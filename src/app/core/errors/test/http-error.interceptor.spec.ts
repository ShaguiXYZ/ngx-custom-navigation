import { HttpClient, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { httpErrorInterceptor } from '../http-error.interceptor';
import { HttpError } from '../http.error';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptors([httpErrorInterceptor])), provideHttpClientTesting()]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 400 Bad Request error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 400 error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 401 Unauthorized error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 401 error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 403 Forbidden error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 403 error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(403);
        expect(error.message).toBe('Forbidden');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });
  });

  it('should handle 404 Not Found error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 404 error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 Internal Server Error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with the 500 error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle unknown error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an unknown error'),
      error: (error: HttpError) => {
        expect(error.status).toBe(0 as HttpStatusCode);
        expect(error.message).toBe('An unknown error occurred!');
      }
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('Unknown Error'));
  });
});
