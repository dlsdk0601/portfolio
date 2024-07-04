import _, { isNil } from "lodash";
import { config } from "../config/config";
import { isBlank } from "../ex/utils";

export class PageUrl<T extends Record<string, any>> {
  readonly pathname: string;

  constructor(pathname: string) {
    this.pathname = pathname;
  }

  get fullUrl() {
    return config.baseUrl + this.pathname;
  }

  url(query?: T) {
    let path = this.pathname;

    if (_.isNil(query)) {
      return path;
    }

    const q: Record<string, string> = {};

    Object.keys(query).forEach((item) => {
      if (isNil(query[item])) {
        return;
      }

      // query 값 중에 path에 있다면 거기에 처리 한다.
      if (path.includes(item)) {
        path = this.pathname.replace(`[${item}]`, `${query[item]}`);
        return;
      }

      q[item] = `${query[item]}`;
    });
    const queryParams = new URLSearchParams(q);

    if (isBlank(queryParams.toString())) {
      return path;
    }

    return `${path}?${queryParams.toString()}`;
  }

  urlPk(query: { pk: number | "new" }) {
    return this.pathname.replace("[pk]", query.pk.toString());
  }
}
