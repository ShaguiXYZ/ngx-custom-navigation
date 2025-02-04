import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageLib } from 'src/app/core/lib';
import { CAPTCHA_TOKEN_KEY, G_RECAPTCHA_RESPONSE } from '../../core/constants';

export const recaptchaInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const token = StorageLib.get(CAPTCHA_TOKEN_KEY);

  if (token) {
    req = req.clone({
      setHeaders: {
        [G_RECAPTCHA_RESPONSE]: token
      }
    });
  }

  return next(req);
};
