import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DataInfo } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { LocationDTO, LocationModel } from '../../models';
import { LocationService } from '../location.service';

describe('LocationService', () => {
  let service: LocationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), LocationService, { provide: HttpClient, useValue: httpClientSpy }]
    });
    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch province by code', async () => {
    const mockResponse: DataInfo = { '01': 'ProvinceName' };
    const provinceCode = '01';

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getProvince(provinceCode).then(result => {
      expect(result).toBe('ProvinceName');
    });
  });

  it('should return undefined for invalid postal code', async () => {
    const result = await service.getAddress('1234');

    expect(result).toBeUndefined();
  });

  it('should fetch address by postal code', async () => {
    const mockProvinceResponse: DataInfo = { '01': 'ProvinceName' };
    const mockLocationResponse: LocationDTO[] = [{ province: '01', code: '234', location: 'LocationName' }] as LocationDTO[];
    const postalCode = '01234';

    httpClientSpy.get.and.returnValues(of(mockProvinceResponse), of(mockLocationResponse));

    service.getAddress(postalCode).then(result => {
      expect(result).toEqual(LocationModel.create('01234', 'ProvinceName', 'LocationName'));
    });
  });

  it('should return undefined if province not found', async () => {
    const mockProvinceResponse: DataInfo = {};
    const postalCode = '01234';

    httpClientSpy.get.and.returnValue(of(mockProvinceResponse));

    service.getAddress(postalCode).then(result => {
      expect(result).toBeUndefined();
    });
  });

  it('should return undefined if location not found', async () => {
    const mockProvinceResponse: DataInfo = { '01': 'ProvinceName' };
    const mockLocationResponse: LocationDTO[] = [];
    const postalCode = '01234';

    httpClientSpy.get.and.returnValues(of(mockProvinceResponse), of(mockLocationResponse));

    service.getAddress(postalCode).then(result => {
      expect(result).toBeUndefined();
    });
  });
});
