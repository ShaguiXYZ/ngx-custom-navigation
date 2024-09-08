export interface QuoteFooterConfig {
  showBack?: boolean;
  showNext: boolean;
  backLabel?: string;
  nextLabel?: string;
  validationFn?: () => boolean;
}
