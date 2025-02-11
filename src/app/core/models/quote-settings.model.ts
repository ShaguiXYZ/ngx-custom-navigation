export interface CommercialExceptionsModel {
  captchaVerified?: boolean;
  /**
   * @deprecated: The activation or deactivation of the flow is controlled at the server level
   *              and is no longer configurable by the client.
   **/
  enableWorkflow?: boolean;
  enableTracking: boolean;
}

export interface QuoteSettingsModel {
  office: number;
  commercialExceptions: CommercialExceptionsModel;
}
