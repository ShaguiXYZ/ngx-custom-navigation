export interface QuoteFooterConfig {
  disableBack?: boolean;
  disableNext?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  info?: { icon?: string; literal: string };
  ignoreQuoteConfig?: boolean;
  /**
   *
   * @returns If the following function needs to prevent the default navigation (navigate to the next page)
   */
  nextFn?: () => void | boolean;
  backFn?: () => void;
}
