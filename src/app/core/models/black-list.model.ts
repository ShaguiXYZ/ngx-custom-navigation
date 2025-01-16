export type BlackListType = 'IDENTIFICATION_NUMBER' | 'PLATE_NUMBER' | 'PHONE_NUMBER' | 'EMAIL';

export interface BlackListResponse {
  blacklisted?: boolean;
  isClient?: boolean;
  hasDebt?: boolean;
}

export interface BlackListModel {
  type: BlackListType;
  value: BlackListResponse;
}
