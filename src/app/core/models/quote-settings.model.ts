export interface CommercialExceptionsModel {
  captchaVerified?: boolean;
  enableWorkFlow: boolean;
  enableTracking: boolean;
}

export interface QuoteSettingsModel {
  office: number;
  commercialExceptions: CommercialExceptionsModel;
}
