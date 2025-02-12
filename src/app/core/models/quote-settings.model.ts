export interface CommercialExceptionsModel {
  captchaVerified?: boolean;
  /**
   * @deprecated: The activation or deactivation of the flow is controlled at the server level
   *              and is no longer configurable by the client.
   **/
  enableWorkflow?: boolean;
  /**
   * @deprecated: Retrievable from the server, but not configurable by the client.
   **/
  enableTracking?: boolean;
}

export interface QuoteSettingsModel {
  journey: string;
  commercialExceptions: CommercialExceptionsModel;
}
