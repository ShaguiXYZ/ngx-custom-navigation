import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { StorageLib } from 'src/app/core/lib';
import { CAPTCHA_TOKEN_KEY, X_RECAPTCHA_RESPONSE } from '../../../core/constants';
import { recaptchaInterceptor } from '../recaptcha.interceptor';

describe('RecaptchaInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptors([recaptchaInterceptor])), provideHttpClientTesting()]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add reCAPTCHA token to headers if token exists', () => {
    const token = 'test-token';
    StorageLib.set(CAPTCHA_TOKEN_KEY, token, 'session');

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has(X_RECAPTCHA_RESPONSE)).toBeTruthy();
    expect(req.request.headers.get(X_RECAPTCHA_RESPONSE)).toBe(token);
  });

  it('should not add reCAPTCHA token to headers if token does not exist', () => {
    StorageLib.remove(CAPTCHA_TOKEN_KEY, 'session');

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has(X_RECAPTCHA_RESPONSE)).toBeFalsy();
  });

  it('should remove reCAPTCHA token from session storage on 403 error', () => {
    const token = 'test-token';
    StorageLib.set(CAPTCHA_TOKEN_KEY, token, 'session');

    httpClient.get('/test').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(403);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(StorageLib.get(CAPTCHA_TOKEN_KEY, 'local')).toBeNull();
  });
});
