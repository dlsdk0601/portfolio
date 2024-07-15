import { AxiosRequestConfig } from "axios";
import { sleep } from "sleepjs";
import { AxiosBase } from "../lib/axios";
import { ApiHandler } from "./api";
import { config } from "../config/config";
import { ResStatus, ValidationError } from "./schema.g";

export interface Res<T> {
  data: T | null;
  errors: string[];
  validationErrors: ValidationError[];
  status: ResStatus;
}

export abstract class ApiBase extends AxiosBase {
  protected readonly handler: ApiHandler;

  constructor(errorHandler: ApiHandler) {
    super();
    this.handler = errorHandler;
  }

  get = async <T>(
    endpoint: string,
    query?: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.handler.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await this.axiosInstance.get(endpoint, {
          ...axiosRequestConfig,
          params: query,
        });
        return this.handleResponse(res.data);
      } catch (e) {
        this.handler.catch(e);
        return null;
      }
    });
  };

  post = async <T>(
    endpoint: string,
    data: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.handler.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await this.axiosInstance.post(endpoint, data, axiosRequestConfig);
        return this.handleResponse(res.data);
      } catch (e) {
        this.handler.catch(e);
        return null;
      }
    });
  };

  put = async <T>(
    url: string,
    data: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.handler.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await this.axiosInstance.put(url, data, axiosRequestConfig);

        return this.handleResponse(res.data);
      } catch (e) {
        this.handler.catch(e);
        return null;
      }
    });
  };

  delete = async <T>(
    url: string,
    data: Record<string, string>,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.handler.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        let pureUrl = url;
        for (const [key, value] of Object.entries(data)) {
          pureUrl = pureUrl.replace(`:${key}`, value);
        }

        const res = await this.axiosInstance.delete(pureUrl, axiosRequestConfig);

        return this.handleResponse(res.data);
      } catch (e) {
        this.handler.catch(e);
        return null;
      }
    });
  };

  g<Q, S>(url: string) {
    return (query?: Q) => this.get<S>(url, query);
  }

  p<Q, S>(url: string) {
    return (data: Q) => this.post<S>(url, data);
  }

  pu<Q, S>(url: string) {
    return (data: Q) => this.put<S>(url, data);
  }

  d<Q extends Record<string, string>, S>(url: string) {
    return (data: Q) => this.delete<S>(url, data);
  }

  private handleResponse<U>(res: Res<U>) {
    if (res.status !== ResStatus.OK) {
      this.handler.handleStatus(res.status);
      return null;
    }

    if (res.validationErrors.length) {
      this.handler.handleValidationErrors(res.validationErrors);
      return null;
    }

    if (res.errors.length) {
      this.handler.handlerErrors(res.errors);
      return null;
    }

    return res.data;
  }
}
