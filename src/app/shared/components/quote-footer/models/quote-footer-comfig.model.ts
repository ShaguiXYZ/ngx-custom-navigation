export interface QuoteFooterConfig {
  showBack?: boolean;
  showNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  nextFn?: () => void;
  backFn?: () => void;
}
