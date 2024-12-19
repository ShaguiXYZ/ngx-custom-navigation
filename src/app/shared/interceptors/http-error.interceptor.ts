import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QUOTE_APP_CONTEXT_DATA } from '../../core/constants';
import { HttpError } from '../../core/errors';
import { AppContextData } from '../../core/models';
import { RoutingService } from '../../core/services';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const contextDataService = inject(ContextDataService);
  const routingService = inject(RoutingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.log('Client-side error');
      } else {
        // Server-side error
        console.log('Server-side error');

        switch (error.status) {
          case HttpStatusCode.BadRequest:
            errorMessage = 'Bad Request';
            break;
          case HttpStatusCode.Unauthorized:
            errorMessage = 'Unauthorized';
            break;
          case HttpStatusCode.Forbidden:
            errorMessage = 'Forbidden';
            break;
          case HttpStatusCode.NotFound:
            errorMessage = 'Not Found';
            break;
          case HttpStatusCode.InternalServerError:
            errorMessage = 'Internal Server Error';
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        const {
          configuration: { errorPageId }
        } = contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

        routingService.goToPage(errorPageId).catch(console.error);
      }

      const httpError = error as HttpErrorResponse;
      return throwError(() => new HttpError(httpError.status, errorMessage, httpError.url ?? '', httpError.error?.method ?? ''));
    })
  );
};
