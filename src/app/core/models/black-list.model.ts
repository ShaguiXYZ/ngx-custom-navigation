export type BlackListType = 'IDENTIFICATION_NUMBER' | 'PLATE_NUMBER' | 'PHONE_NUMBER' | 'EMAIL';

export interface BlackListModel {
  type: BlackListType;
  value: boolean;
}
