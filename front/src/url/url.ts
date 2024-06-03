import _ from "lodash";
import { config } from "../config/config";

export class PageUrl {
  readonly pathname: string;

  constructor(pathname: string) {
    this.pathname = pathname;
  }

  get fullUrl() {
    return config.baseUrl + this.pathname;
  }

  url(query?: Record<string, string>) {
    if (_.isNil(query)) {
      return this.pathname;
    }

    const q = new URLSearchParams(query);
    return `${this.pathname}?${q}`;
  }

  urlPk(query: { pk: number | "new" }) {
    return this.pathname.replace("[pk]", query.pk.toString());
  }
}
