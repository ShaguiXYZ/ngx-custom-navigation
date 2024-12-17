import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpService } from '@shagui/ng-shagui/core';
import { IconDictionary } from 'src/app/core/models';
import { BrandComponentService } from './vehicle-brand.service';

describe('BrandComponentService', () => {
  let service: BrandComponentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), BrandComponentService, HttpService]
    });
    service = TestBed.inject(BrandComponentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch icon brands', async () => {
    const mockIconDictionary: IconDictionary = {
      /* mock data */
    };

    service.iconBrands().then(data => {
      expect(data).toEqual(mockIconDictionary);
    });

    const req = httpMock.expectOne('assets/json/mock/icon-brands');
    expect(req.request.method).toBe('GET');
    req.flush(mockIconDictionary);
  });

  it('should handle 404 error for icon brands', async () => {
    service.iconBrands().catch(error => {
      expect(error.status).toBe(HttpStatusCode.NotFound);
    });

    const req = httpMock.expectOne('assets/json/mock/icon-brands');
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: HttpStatusCode.NotFound, statusText: 'Not Found' });
  });
});
