export interface IndexedData<T = string, K extends string | number | symbol = string> {
  index: K;
  data: T;
}
