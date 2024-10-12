export interface QuoteFooterConfig {
  disableBack?: boolean;
  disableNext?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  nextFn?: () => void;
  backFn?: () => void;
}
