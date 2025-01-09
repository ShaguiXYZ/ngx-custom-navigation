import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CAPTCHA_TOKEN_KEY, G_RECAPTCHA_RESPONSE } from '../../core/constants';
import { HttpError } from '../../core/errors';
import { StorageLib } from 'src/app/core/lib';

export const recaptchaInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = StorageLib.get(CAPTCHA_TOKEN_KEY);

  if (token) {
    req = req.clone({
      setHeaders: {
        [G_RECAPTCHA_RESPONSE]: token
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Forbidden) {
        console.log('Forbidden error');
        StorageLib.remove(CAPTCHA_TOKEN_KEY);
      }

      const httpError = error as HttpErrorResponse;
      return throwError(() => new HttpError(httpError.status, 'reCAPTCHAR  Error', httpError.url ?? '', httpError.error?.method ?? ''));
    })
  );
};
