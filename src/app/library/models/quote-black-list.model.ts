import { BlackListResponse } from '../../core/models/black-list.model';

/* eslint-disable @typescript-eslint/no-namespace */
export interface QuoteBlackList {
  email?: BlackListResponse;
  identificationNumber?: BlackListResponse;
  phoneNumber?: BlackListResponse;
  plateNumber?: BlackListResponse;
}

export namespace QuoteBlackList {
  export const init = (): QuoteBlackList => ({});
}
