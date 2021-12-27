export interface Page<T> {
  total: number;
  list: T[];
}

export interface PageQuery {
  page: number;
  perPage: number;
}
