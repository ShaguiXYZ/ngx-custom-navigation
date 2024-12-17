import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { CAPTCHA_TOKEN_KEY, G_RECAPTCHA_RESPONSE } from '../constants';
import { HttpError } from '../errors';

export const recaptchaInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = sessionStorage.getItem(CAPTCHA_TOKEN_KEY);

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
        sessionStorage.removeItem(CAPTCHA_TOKEN_KEY);
      }

      const httpError = error as HttpErrorResponse;
      return throwError(() => new HttpError(httpError.status, 'reCAPTCHAR  Error', httpError.url ?? '', httpError.error?.method ?? ''));
    })
  );
};
