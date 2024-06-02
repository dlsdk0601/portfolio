import { ParsedUrlQueryInput } from "querystring";
import _ from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import { isBlank, removeSuffix } from "../ex/utils";
import { config } from "../config/config";

export class PageUrl {
  readonly pathname: string;

  constructor(pathname: string) {
    this.pathname = pathname;
  }

  get fullUrl() {
    return config.baseUrl + this.pathname;
  }

  setQuery(
    searchParams: ReadonlyURLSearchParams,
    currentQuery: Record<string, any>,
  ) {
    const params = new URLSearchParams(searchParams.toString());

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(currentQuery)) {
      const value = currentQuery[key];

      if (isBlank(value)) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    return `${this.pathname}?${params.toString()}`;
  }

  url(query?: ParsedUrlQueryInput) {
    if (_.isNil(query)) {
      return this.pathname;
    }

    // OPT :: 확인 해보고 new URLSearchParams 로 수정
    const queryArr = Object.keys(query ?? {}).map((key) => {
      const value = this.codecQueryValue(query[key]);
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
    const queryString = queryArr.join("&");

    return `${this.pathname}?${queryString}`;
  }

  urlPk(query: { pk: number | "new" }) {
    const pureUrl = removeSuffix(this.pathname, "pk");

    return `${pureUrl}${query.pk}`;
  }

  codecQueryValue(
    value:
      | string
      | number
      | boolean
      | readonly string[]
      | readonly number[]
      | readonly boolean[]
      | null
      | undefined,
  ) {
    if (_.isNil(value)) {
      return "";
    }

    if (_.isArray(value)) {
      // 굳이 복사 하는 이유는 ts 가 타입 추적을 못함..
      const newValue:
        | readonly string[]
        | readonly number[]
        | readonly boolean[] = [...value];
      const arr = newValue.map((item) => item.toString());
      return _.head(arr)?.toString() ?? "";
    }

    return value.toString();
  }
}
