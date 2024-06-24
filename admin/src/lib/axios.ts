import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isNil } from "lodash";
import { config } from "../config/config";

export class AxiosBase {
  axiosInstance = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(this.beforeRequest, this.onError);
    this.axiosInstance.interceptors.response.use(this.beforeResponse, this.onError);
  }

  beforeRequest = async (axiosConfig: InternalAxiosRequestConfig<any>) => {
    axiosConfig.headers = axiosConfig.headers ?? {};

    const session = sessionStorage.getItem(config.sessionStorageKey);
    if (isNil(session)) {
      return axiosConfig;
    }

    const state: { state: { refreshToken: string; token: string }; version: number } =
      JSON.parse(session);

    if (!isNil(state)) {
      axiosConfig.headers["Authorization"] = `Bearer ${state.state.token}`;
    }

    return axiosConfig;
  };

  beforeResponse = async (res: AxiosResponse<any, any>) => res;

  onError = (err: any) => {
    return Promise.reject(err);
  };
}
