import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpError } from './http.error';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        return throwError(() => new HttpError(error.status, errorMessage));
      } else {
        // Server-side error
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

        return throwError(() => new HttpError(error.status, errorMessage));
      }
    })
  );
};
