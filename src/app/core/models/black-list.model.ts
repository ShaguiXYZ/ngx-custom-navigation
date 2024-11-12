export type BlackListType = 'NIF' | 'PLATE' | 'PHONE' | 'EMAIL';

export interface BlackListModel {
  type: BlackListType;
  value: boolean;
}
