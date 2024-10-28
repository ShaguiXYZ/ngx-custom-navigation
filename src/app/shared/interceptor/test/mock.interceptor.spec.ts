/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { of } from 'rxjs';
import { mockInterceptor } from '../mock.interceptor';

describe('mockInterceptor', () => {
  it('should not modify the URL if it does not include "assets/json/mock"', () => {
    const req = new HttpRequest('GET', 'assets/json/data');
    const next: HttpHandlerFn = (request: HttpRequest<any>) => of({} as HttpEvent<any>);

    mockInterceptor(req, next).subscribe(response => {
      expect(req.url).toBe('assets/json/data');
    });
  });

  it('should call the next handler with the modified request', () => {
    const req = new HttpRequest('GET', 'assets/json/mock/data');
    const next: HttpHandlerFn = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    mockInterceptor(req, next).subscribe(response => {
      expect(next).toHaveBeenCalledWith(req.clone({ url: 'assets/json/mock/data.mock.json' }));
    });
  });

  it('should call the next handler with the original request if URL does not include "assets/json/mock"', () => {
    const req = new HttpRequest('GET', 'assets/json/data');
    const next: HttpHandlerFn = jasmine.createSpy('next').and.returnValue(of({} as HttpEvent<any>));

    mockInterceptor(req, next).subscribe(response => {
      expect(next).toHaveBeenCalledWith(req);
    });
  });
});
