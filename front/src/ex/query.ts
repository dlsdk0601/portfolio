import moment from "moment";
import { isNil } from "lodash";
import { SearchParams } from "../type/definitions";

const parseValue = (key: string, value: string) => {
  if (key.endsWith("At")) {
    return moment(value).toDate();
  }

  if (value === "true" || value === "false") {
    return value === "true";
  }

  if (!isNaN(parseInt(value, 10))) {
    return parseInt(value, 10);
  }

  return value;
};

export const parseQuery = <T>(q: SearchParams): Partial<T> => {
  const query: Partial<T> = {};

  Object.entries(q).forEach(([key, v]) => {
    if (isNil(v)) {
      return;
    }

    query[key as keyof T] = parseValue(key, v) as T[keyof T];
  });

  return query;
};
