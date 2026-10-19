import { BlackListResponse } from '../../core/models/black-list.model';

export interface QuoteBlackList {
  email?: BlackListResponse;
  identificationNumber?: BlackListResponse;
  phoneNumber?: BlackListResponse;
  plateNumber?: BlackListResponse;
}
