import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from '@shagui/ng-shagui/core';
import { IconDictionary } from 'src/app/core/models';
import { InsuranceComponentService } from './insurance.service';

describe('InsuranceComponentService', () => {
  let service: InsuranceComponentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), InsuranceComponentService, HttpService]
    });
    service = TestBed.inject(InsuranceComponentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch icon insurances', async () => {
    const mockResponse: IconDictionary = {
      /* mock data */
    };

    service.iconInsurances().then(data => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('assets/json/mock/icon-insurances');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle 404 error for icon insurances', async () => {
    service.iconInsurances().catch(error => {
      expect(error.status).toBe(HttpStatusCode.NotFound);
    });

    const req = httpMock.expectOne('assets/json/mock/icon-insurances');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: HttpStatusCode.NotFound, statusText: 'Not Found' });
  });
});
