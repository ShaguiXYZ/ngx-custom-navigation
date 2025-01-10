import { QuoteFormValidation } from '../form';

export interface FormValidationSettings {
  disabled?: boolean;
}

export type PageFormValidationSettings = Record<string, Partial<Record<QuoteFormValidation, FormValidationSettings>>>;
