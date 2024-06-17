import { isNaN, isNil } from "lodash";

export function parseIntSafe(value: string): number | undefined {
  const i = parseInt(value, 10);
  return isNaN(i) ? undefined : i;
}

export function parseFloatSafe(value: string): number | undefined {
  const i = parseFloat(value);
  return isNaN(i) ? undefined : i;
}

// return "123,456,789"
export function mf1(value: number | null | undefined): string {
  if (isNil(value)) {
    return "";
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// return "12,123.00"
export function mf2(value: number | null | undefined): string {
  if (isNil(value)) {
    return "";
  }
  return value
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
