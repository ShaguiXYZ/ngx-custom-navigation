import { HttpClient, HttpErrorResponse, HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { RoutingService } from '../../services';
import { httpErrorInterceptor } from '../http-error.interceptor';
import { HttpError } from '../http.error';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let routingServiceSpy: jasmine.SpyObj<RoutingService>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    routingServiceSpy = jasmine.createSpyObj('RoutingService', ['goToPage']);
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ContextDataService, useValue: contextDataServiceSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);

    routingServiceSpy.goToPage.and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should handle 400 Bad Request error', () => {
    contextDataServiceSpy.get.and.returnValue({ configuration: { errorPageId: 'error-page' } });

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 400 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Bad Request');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });

    expect(routingServiceSpy.goToPage).toHaveBeenCalledWith('error-page');
  });

  it('should handle 401 Unauthorized error', () => {
    contextDataServiceSpy.get.and.returnValue({ configuration: { errorPageId: 'error-page' } });

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 401 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(401);
        expect(error.message).toBe('Unauthorized');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(routingServiceSpy.goToPage).toHaveBeenCalledWith('error-page');
  });

  it('should handle 404 Not Found error', () => {
    contextDataServiceSpy.get.and.returnValue({ configuration: { errorPageId: 'error-page' } });

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 404 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(error.message).toBe('Not Found');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });

    expect(routingServiceSpy.goToPage).toHaveBeenCalledWith('error-page');
  });

  it('should handle 500 Internal Server Error', () => {
    contextDataServiceSpy.get.and.returnValue({ configuration: { errorPageId: 'error-page' } });

    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with 500 error'),
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.message).toBe('Internal Server Error');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush('Internal Server Error', { status: 500, statusText: 'Internal Server Error' });

    expect(routingServiceSpy.goToPage).toHaveBeenCalledWith('error-page');
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
