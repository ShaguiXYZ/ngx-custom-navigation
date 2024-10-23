import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, 'assets/i18n/', '.json');

export class CustomMissingTranslationHandler implements MissingTranslationHandler {
  public handle(params: MissingTranslationHandlerParams): string {
    console.warn('i18n: Parameter not found', params.key);

    return '';
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
