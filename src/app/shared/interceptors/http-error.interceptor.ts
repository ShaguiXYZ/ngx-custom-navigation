import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpError } from 'src/app/core/errors';

type StatusCodes =
  | HttpStatusCode.BadRequest
  | HttpStatusCode.Unauthorized
  | HttpStatusCode.Forbidden
  | HttpStatusCode.NotFound
  | HttpStatusCode.InternalServerError;

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse): Observable<never> => {
      let errorMessage = error.statusText ?? 'Unknown error';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error(`Client-side error (${error.status})`);
      } else {
        // Server-side error
        const httpErrorMessage: Record<StatusCodes, string> = {
          [HttpStatusCode.BadRequest]: 'Bad Request',
          [HttpStatusCode.Forbidden]: 'Forbidden',
          [HttpStatusCode.InternalServerError]: 'Internal Server Error',
          [HttpStatusCode.NotFound]: 'Not Found',
          [HttpStatusCode.Unauthorized]: 'Unauthorized'
        };

        errorMessage = `${httpErrorMessage[error.status as StatusCodes] ?? errorMessage} (${error.status})`;

        console.error(`Server-side error: ${errorMessage}`);
      }

      return new Observable<never>(observer => {
        observer.error(new HttpError(error.status, errorMessage, error.url, req.method, true));
      });
    })
  );
};
