/* eslint-disable @typescript-eslint/no-namespace */
import { InjectionToken } from '@angular/core';

export type LanguageType = string;
export type CountryType = string;
export type LocateType = `${LanguageType}-${CountryType}`;

export const STORAGE_LANGUAGE_KEY = 'LANGUAGE_CONFIG';
export const Languages: Record<LocateType, LocaleConfig> = {
  'ca-ES': { value: 'Català', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] },
  'de-DE': { value: 'Deutsch', format: 'DD.MM.YYYY', formats: ['DD.MM.YYYY', 'DD.MM.YY', 'DDMMYYYY', 'DDMMYY'] },
  'en-GB': { value: 'English', format: 'MM/DD/YYYY', formats: ['MM/DD/YYYY', 'MM/DD/YY', 'MMDDYYYY', 'MMDDYY'] },
  'en-US': { value: 'English', format: 'MM/DD/YYYY', formats: ['MM/DD/YYYY', 'MM/DD/YY', 'MMDDYYYY', 'MMDDYY'] },
  'es-ES': { value: 'Español (España)', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] },
  'fr-FR': { value: 'Français', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] },
  'pt-PT': { value: 'Português (Portugal)', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] }
};

export const NX_LANGUAGE_CONFIG = new InjectionToken<Partial<LanguageConfig> & { languages: Record<string, LocaleConfig> }>(
  'NX_LANGUAGE_CONFIG'
);

export interface LocaleConfig {
  value: string;
  format?: string;
  formats?: string[];
}

export interface LanguageConfig {
  current: LocateType;
  languages: Record<LocateType, LocaleConfig>;
}

export namespace LanguageConfig {
  export const language = (locale: LocateType): LanguageType => locale.split('-')[0];
  export const country = (locale: LocateType): CountryType => locale.split('-')[1];
}
