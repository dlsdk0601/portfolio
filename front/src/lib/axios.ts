import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
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
    return axiosConfig;
  };

  beforeResponse = async (res: AxiosResponse<any, any>) => res;

  onError = (err: any) => {
    return Promise.reject(err);
  };
}
