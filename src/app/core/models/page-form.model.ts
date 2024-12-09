import { QuoteFormValidations } from '../form';

export interface FormValidationSettings {
  disabled?: boolean;
}

export interface PageFormValidationSettings {
  [controlName: string]: Partial<Record<QuoteFormValidations, FormValidationSettings>>;
}
