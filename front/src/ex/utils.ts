import { ParsedUrlQuery } from "querystring";
import { BaseSyntheticEvent } from "react";
import {
  head,
  isArray,
  isDate,
  isEmpty,
  isNil,
  isNull,
  isNumber,
  isString,
  isUndefined,
} from "lodash";
import moment, { Moment } from "moment";

export const returnTo = (query: ParsedUrlQuery): string | undefined => {
  const returnTo = query.returnTo;
  if (typeof returnTo === "string" && returnTo.length) {
    return returnTo;
  }
};

export const preventDefault = (e: BaseSyntheticEvent) => {
  e.preventDefault();
};

export const preventDefaulted = <T extends BaseSyntheticEvent>(
  block: (e: T) => any,
): ((e: T) => void) => {
  return (e) => {
    e.preventDefault();
    block(e);
  };
};

export const isBlank = (value: any): value is null | undefined => {
  if (value === "") {
    return true;
  }

  if (isNull(value)) {
    return true;
  }

  if (isUndefined(value)) {
    return true;
  }

  // noinspection RedundantIfStatementJS
  if (isArray(value) && isEmpty(value)) {
    return true;
  }

  return false;
};

export const isNotBlank = (value: any) => {
  return !isBlank(value);
};

export const isAllBlank = (value: any[]): boolean => {
  for (let i = 0; i < value.length; i++) {
    const val = isBlank(value[i]);
    if (val) {
      return true;
    }
  }
  return false;
};

export const removePrefix = (str: string, prefix: string) => {
  if (str.startsWith(prefix)) {
    return str.substring(prefix.length);
  }

  return str;
};

export const removeSuffix = (str: string, suffix: string) => {
  if (str.endsWith(suffix)) {
    return str.substring(0, str.length - suffix.length);
  }

  return str;
};

export const ignorePromise = <T>(block: () => Promise<T>) => {
  block().then(() => {});
};

export type NotNil<T> = T extends null | undefined | void ? never : T;

export function isNotNil<T>(value: T): value is NotNil<T> {
  return !isNil(value);
}

export function dateFormatter(
  datetime: Date | string | number | Moment | null | undefined,
  format: string = "YYYY-MM-DD",
): string {
  if (isNil(datetime)) {
    return "";
  }

  if (isNumber(datetime)) {
    return dateFormatter(moment(datetime), format);
  }

  if (isString(datetime)) {
    return dateFormatter(moment(datetime), format);
  }

  if (isDate(datetime)) {
    return dateFormatter(moment(datetime), format);
  }

  return datetime.format(format);
}

export function phoneNum(phone: string | null): string {
  if (isNil(phone)) {
    return "";
  }
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length > 11) {
    return "";
  }

  let matcher: RegExp = /^(\d{3})(\d{4})(\d{4})$/;
  if (cleaned.length === 10) {
    matcher = /^(\d{3})(\d{3})(\d{4})$/;
  }

  const match = cleaned.match(matcher);
  if (!match) {
    return "";
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function phoneOnlyNumber(phone: string | null) {
  const newPhone = phoneNum(phone);

  if (isBlank(phone)) {
    return "";
  }

  return newPhone.replaceAll("-", "");
}

export const isPassword = (value: string | null | undefined): boolean => {
  // 값이 없을 경우 무시
  if (isNil(value) || isEmpty(value)) {
    return false;
  }

  let count = 0;
  if (value.match(/[A-Z]/)) {
    count++;
  }

  if (value.match(/[a-z]/)) {
    count++;
  }

  if (value.match(/[0-9]/)) {
    count++;
  }

  if (value.match(/[#?!@$%^&*-]/)) {
    count++;
  }

  return !(value.length <= 8 || count < 3);
};

export const isPhone = (value: string): boolean => {
  if (isNil(value) || isEmpty(value)) {
    return false;
  }

  if (!value.match(/^010-?([0-9]{4})-?([0-9]{4})$/)) {
    return false;
  }

  return true;
};

export function validatePageQuery(page: string | string[] | undefined): number | null {
  if (isNil(page) || isArray(page)) {
    return null;
  }

  const pageNum = Number(page);

  if (isNaN(pageNum)) {
    return null;
  }

  return pageNum;
}

export function validatePk(pk: string | string[] | undefined): number | null {
  if (isNil(pk) || isArray(pk)) {
    return null;
  }

  if (pk === "new") {
    return null;
  }

  const numberPk = Number(pk);

  if (isNaN(numberPk)) {
    return null;
  }

  return numberPk;
}

// 제일 기본 query 처리 함수
export function queryFilter(query: string | string[] | undefined): string {
  // undefined 나 query[0] 이 제대로 된값이 아니면 어차피 에러 처리가 되어야 한다.
  if (isNil(query)) {
    return "";
  }

  if (isArray(query)) {
    return head(query) ?? "";
  }

  return query;
}
