import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { httpErrorInterceptor } from '../http-error.interceptor';

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
      next: () => fail('should have failed with 400 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe('Bad Request (400)');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });

  it('should handle 401 Unauthorized error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe('Unauthorized (401)');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle 404 Not Found error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe('Not Found (404)');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('should handle 500 Internal Server Error', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.message).toBe('Internal Server Error (500)');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
