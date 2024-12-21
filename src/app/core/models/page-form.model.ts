import { QuoteFormValidations } from '../form';

export interface FormValidationSettings {
  disabled?: boolean;
}

export type PageFormValidationSettings = Record<string, Partial<Record<QuoteFormValidations, FormValidationSettings>>>;
