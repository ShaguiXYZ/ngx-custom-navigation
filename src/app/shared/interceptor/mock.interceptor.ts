import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const mockInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  if (/\/(mock|stub)\//.test(req.url)) {
    req = req.clone({ url: `${req.url}.mock.json` });
  }

  return next(req);
};
