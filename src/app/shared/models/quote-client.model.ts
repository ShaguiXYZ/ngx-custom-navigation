/* eslint-disable @typescript-eslint/no-namespace */

export interface QuoteClientModel {
  isClient?: boolean;
  isPolicyOwner?: boolean;
  accidents?: number;
  accepInfo?: boolean;
  acceptPrivacyPolicy?: boolean;
  dateOfIssue?: Date;
}

export namespace QuoteClientModel {
  export const init = (): QuoteClientModel => ({ accepInfo: false });
}
