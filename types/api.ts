export type ResponseObject<T> = {
  data: T;
  message?: string;
  code?: string;
};
