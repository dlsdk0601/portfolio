import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isNil } from "lodash";
import { config } from "../config/config";
import { RefreshTokenRes, Res } from "../api/schema.g";
import { managerModel } from "../store/managerModel";

interface AxiosRequestConfig<T> extends InternalAxiosRequestConfig<T> {
  withRefreshToken?: boolean;
}

export class AxiosBase {
  axiosInstance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(this.beforeRequest, this.onError);
    this.axiosInstance.interceptors.response.use(this.beforeResponse, this.onError);
  }

  get getSession() {
    const session = sessionStorage.getItem(config.sessionStorageKey);
    if (isNil(session)) {
      return null;
    }

    const state: { state: { refreshToken: string; token: string }; version: number } =
      JSON.parse(session);

    return state;
  }

  get authorization() {
    const session = this.getSession;

    // authorization 이 null 이라면 재요청에서 LOGIN_REQUIRED 로 다시 넘어올 것이다.
    if (isNil(session)) {
      return null;
    }

    return `Bearer ${session.state.token}`;
  }

  get authorizationRefresh() {
    const session = this.getSession;

    if (isNil(session)) {
      return null;
    }

    return `Bearer ${session.state.refreshToken}`;
  }

  beforeRequest = async (axiosConfig: AxiosRequestConfig<any>) => {
    axiosConfig.headers = axiosConfig.headers ?? {};

    const session = this.getSession;

    if (isNil(session)) {
      return axiosConfig;
    }

    if (!isNil(session.state.token) && !axiosConfig.withRefreshToken) {
      axiosConfig.headers["Authorization"] = this.authorization;
    }

    if (!isNil(session.state.token) && axiosConfig.withRefreshToken) {
      axiosConfig.headers["Authorization"] = this.authorizationRefresh;
    }

    return axiosConfig;
  };

  beforeResponse = async (res: AxiosResponse<Res<any>, any>) => {
    const status = res.data.status;

    // jwt 토큰이 만료가 아닐 경우만 넘긴다.
    // 그외 에러는 다음 단계에서 처리한다.
    if (status !== "EXPIRED_TOKEN") {
      return res;
    }

    await this.onRefresh();

    const config = res.config;
    config.headers.Authorization = this.authorization;

    return this.axiosInstance(config);
  };

  onError = (err: any) => {
    return Promise.reject(err);
  };

  async onRefresh() {
    const res: AxiosResponse<Res<RefreshTokenRes>, any> = await this.axiosInstance.post(
      "/admin/api/refresh",
      {},
      {
        withRefreshToken: true,
      } as AxiosRequestConfig<any>,
    );

    if (isNil(res.data.data)) {
      return;
    }

    managerModel.setState({ token: res.data.data.token });
  }
}
