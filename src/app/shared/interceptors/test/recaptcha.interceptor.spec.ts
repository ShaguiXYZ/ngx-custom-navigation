import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CAPTCHA_TOKEN_KEY, G_RECAPTCHA_RESPONSE } from '../../../core/constants';
import { HttpError } from '../../../core/errors';
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
    sessionStorage.setItem(CAPTCHA_TOKEN_KEY, token);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has(G_RECAPTCHA_RESPONSE)).toBeTruthy();
    expect(req.request.headers.get(G_RECAPTCHA_RESPONSE)).toBe(token);
  });

  it('should not add reCAPTCHA token to headers if token does not exist', () => {
    sessionStorage.removeItem(CAPTCHA_TOKEN_KEY);

    httpClient.get('/test').subscribe();

    const req = httpMock.expectOne('/test');
    expect(req.request.headers.has(G_RECAPTCHA_RESPONSE)).toBeFalsy();
  });

  it('should remove reCAPTCHA token from session storage on 403 error', () => {
    const token = 'test-token';
    sessionStorage.setItem(CAPTCHA_TOKEN_KEY, token);

    httpClient.get('/test').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(403);
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({}, { status: 403, statusText: 'Forbidden' });

    expect(sessionStorage.getItem(CAPTCHA_TOKEN_KEY)).toBeNull();
  });

  it('should throw HttpError on error response', () => {
    const token = 'test-token';
    sessionStorage.setItem(CAPTCHA_TOKEN_KEY, token);

    httpClient.get('/test').subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error).toBeInstanceOf(HttpError);
        expect(error.status).toBe(403);
        expect(error.message).toBe('reCAPTCHAR  Error');
      }
    });

    const req = httpMock.expectOne('/test');
    req.flush({ method: 'GET' }, { status: 403, statusText: 'Forbidden' });
  });
});
