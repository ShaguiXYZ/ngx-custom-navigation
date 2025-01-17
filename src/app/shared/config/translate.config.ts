import { HttpClient } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): undefined {
    console.warn('i18n: Parameter not found', params.key);

    return undefined;
  }
}

export const TRANSLATE_MODULE_CONFIG: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient]
  },
  missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler }
};

export const LanguageConfig = {
  current: LOCALE_ID,
  languages: {
    'en-GB': 'English',
    'es-ES': 'Español (España)',
    'ca-ES': 'Català',
    'pt-PT': 'Português (Portugal)'
  }
};
