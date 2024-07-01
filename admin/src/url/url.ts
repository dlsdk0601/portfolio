import _ from "lodash";
import { config } from "../config/config";

export class PageUrl<T extends Record<string, any>> {
  readonly pathname: string;

  constructor(pathname: string) {
    this.pathname = pathname;
  }

  get fullUrl() {
    return config.baseUrl + this.pathname;
  }

  url(query?: T) {
    if (_.isNil(query)) {
      return this.pathname;
    }

    const q: Record<string, string> = {};

    Object.keys(query).forEach((item) => {
      q[item] = `${query[item]}`;
    });
    const queryParams = new URLSearchParams(q);
    return `${this.pathname}?${queryParams.toString()}`;
  }

  urlPk(query: { pk: number | "new" }) {
    return this.pathname.replace("[pk]", query.pk.toString());
  }
}
