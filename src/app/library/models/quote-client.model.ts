export interface QuoteClientModel {
  isClient?: boolean;
  isPolicyOwner?: boolean;
  accidents?: number;
  accepInfo?: boolean;
  acceptPrivacyPolicy?: boolean;
  dateOfIssue?: Date;
  expiration?: Date;
  isCurrentlyInsured?: boolean;
}
