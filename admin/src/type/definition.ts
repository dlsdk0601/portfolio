export interface PageRow<T> {
  /** No */
  no: number;
  item: T;
}

export interface Pagination<T> {
  page: number;
  pages: number[];
  prevPage: number;
  nextPage: number;
  hasPrev: boolean;
  hasNext: boolean;
  total: number | null;
  rows: PageRow<T>[];
}
