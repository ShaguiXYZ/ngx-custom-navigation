export interface QuoteFooterConfig {
  disableBack?: boolean;
  disableNext?: boolean;
  showBack?: boolean;
  showNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  nextFn?: () => void;
  backFn?: () => void;
}
