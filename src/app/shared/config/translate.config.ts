import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateModuleConfig } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import countries from 'i18n-iso-countries';
import ca from 'i18n-iso-countries/langs/ca.json';
import en from 'i18n-iso-countries/langs/en.json';
import es from 'i18n-iso-countries/langs/es.json';
import pt from 'i18n-iso-countries/langs/pt.json';

countries.registerLocale(en);
countries.registerLocale(es);
countries.registerLocale(ca);
countries.registerLocale(pt);

export const createTranslateLoader = () =>
  provideTranslateHttpLoader({
    prefix: 'assets/i18n/',
    suffix: '.json',
    enforceLoading: false,
    useHttpBackend: false
  });

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): undefined {
    console.warn('i18n: Parameter not found', params.key);

    return undefined;
  }
}

export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  loader: createTranslateLoader(),
  missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler }
};

export const nxLanguageConfig = {
  languages: {
    'en-GB': { value: 'English', format: 'MM/DD/YYYY', formats: ['MM/DD/YYYY', 'MM/DD/YY', 'MMDDYYYY', 'MMDDYY'] },
    'es-ES': { value: 'Español (España)', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] },
    'ca-ES': { value: 'Català', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] },
    'pt-PT': { value: 'Português (Portugal)', format: 'DD/MM/YYYY', formats: ['DD/MM/YYYY', 'DD/MM/YY', 'DDMMYYYY', 'DDMMYY'] }
  }
};
