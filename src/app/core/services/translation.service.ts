import { inject, Injectable } from '@angular/core';
import { HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { _Error, HttpError } from '../errors';
import { QuoteTranslateRequest, QuoteTranslateResponse } from '../models';
import { LanguageService } from './language.service';

const TRANSLATION_API = '/translate';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  // private apiUrl = 'https://libretranslate.com/translate';

  private readonly httpService = inject(HttpService);
  private readonly languageService = inject(LanguageService);

  translate(text: string): Promise<QuoteTranslateResponse> {
    const body = QuoteTranslateRequest.create(text, this.languageService.current);

    return firstValueFrom(
      this.httpService
        .post<QuoteTranslateRequest, QuoteTranslateResponse>(`${environment.baseUrl}${TRANSLATION_API}`, body, {
          showLoading: false,
          onError: error => {
            _Error.throw(new HttpError(error.status, error.statusText, error.url, error.method, false));
          }
        })
        .pipe(
          map(response => {
            return response as QuoteTranslateResponse;
          })
        )
    );
  }
}
