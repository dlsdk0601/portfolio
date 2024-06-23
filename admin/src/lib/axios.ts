import axios, { AxiosRequestConfig } from "axios";
import { sleep } from "sleepjs";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { blockModel } from "../store/blockModel";
import { config } from "../config/config";

export const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (axiosConfig) => {
    // login 기반의 웹이 아니라서 token 처리는 하지 않는다.
    return axiosConfig;
  },
  (err) => {
    return Promise.reject(err);
  },
);

axiosInstance.interceptors.response.use(
  async (res) => {
    return res;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export class ApiBase {
  private counter = 0;

  with = async <T>(block: () => Promise<T>) => {
    unstable_batchedUpdates(() => blockModel.getState().up());
    try {
      return block();
    } finally {
      unstable_batchedUpdates(() => blockModel.getState().down());
    }
  };

  errHandle = (err: unknown) => {
    // TODO :: 에러 메세지 처리를 어떻게 할지 결정하면 추가
    if (axios.isAxiosError(err)) {
      return err.response?.data.message ?? err.message;
    }

    return "서버 통신이 원활하지 않습니다./n잠시 후 다시 이용해주세요.";
  };

  get = async <T>(
    endpoint: string,
    query?: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await axiosInstance.get(endpoint, { ...axiosRequestConfig, params: query });
        return res.data;
      } catch (e) {
        this.errHandle(e);
        return null;
      }
    });
  };

  post = async <T>(
    endpoint: string,
    data: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await axiosInstance.post(endpoint, data, axiosRequestConfig);
        return res.data;
      } catch (e) {
        this.errHandle(e);
        return null;
      }
    });
  };

  put = async <T>(
    url: string,
    data: any,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        const res = await axiosInstance.put(url, data, axiosRequestConfig);

        return res.data;
      } catch (e) {
        this.errHandle(e);
        return null;
      }
    });
  };

  delete = async <T>(
    url: string,
    data: Record<string, string>,
    axiosRequestConfig?: AxiosRequestConfig<any>,
  ): Promise<T | null> => {
    return this.with(async () => {
      try {
        if (config.apiDelay) {
          await sleep(config.apiDelay);
        }

        let pureUrl = url;
        for (const [key, value] of Object.entries(data)) {
          pureUrl = pureUrl.replace(`:${key}`, value);
        }

        const res = await axiosInstance.delete(pureUrl, axiosRequestConfig);

        return res.data;
      } catch (e) {
        this.errHandle(e);
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
}
