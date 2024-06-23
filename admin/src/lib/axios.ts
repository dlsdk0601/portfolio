import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { isNil } from "lodash";
import { config } from "../config/config";

export class AxiosBase {
  axiosInstance = axios.create({
    baseURL: `${config.baseUrl}/api`,
    withCredentials: true,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(this.beforeRequest, this.onError);
    this.axiosInstance.interceptors.response.use(this.beforeResponse, this.onError);
  }

  beforeRequest = async (axiosConfig: InternalAxiosRequestConfig<any>) => {
    axiosConfig.headers = axiosConfig.headers ?? {};

    const token = sessionStorage.getItem(config.sessionStorageKey);
    if (!isNil(token)) {
      axiosConfig.headers["Authorization"] = `Bearer ${token}`;
    }

    return axiosConfig;
  };

  beforeResponse = async (res: AxiosResponse<any, any>) => res;

  onError = (err: any) => {
    return Promise.reject(err);
  };
}
