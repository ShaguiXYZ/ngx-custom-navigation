import { InjectionToken } from '@angular/core';

export const STORAGE_LANGUAGE_KEY = 'LANGUAGE_CONFIG';
export const Languages = {
  'en-GB': 'English',
  'es-CO': 'Español (Colombia)',
  'es-ES': 'Español (España)',
  'pt-BR': 'Português (Brasil)',
  'pt-PT': 'Português (Portugal)'
};

export const NX_LANGUAGE_CONFIG = new InjectionToken<Partial<LanguageConfig> & { languages: Record<string, string> }>('NX_LANGUAGE_CONFIG');

export interface LanguageConfig {
  current: string;
  languages: Record<string, string>;
}
