import { TestBed } from '@angular/core/testing';
import { LocationService } from '../localtion.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('LocationService', () => {
  let service: LocationService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [LocationService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return undefined for invalid postal code length', async () => {
    const result = await service.getAddresses('123');
    expect(result).toBeUndefined();
  });

  it('should return undefined for non-existent province code', async () => {
    const result = await service.getAddresses('99999');
    expect(result).toBeUndefined();
  });

  it('should return correct address for another valid postal code', async () => {
    const expectedValue = {
      province: '46',
      code: '001',
      dc: '9',
      location: 'location46'
    };

    httpClientSpy.get.and.returnValue(of([expectedValue]));

    const result = await service.getAddresses('46001');

    expect(result).toEqual({ postalCode: '46001', province: 'Valencia', provinceCode: '46', location: 'location46' });
  });

  it('should return undefined for postal code with invalid characters', async () => {
    const result = await service.getAddresses('28A01');
    expect(result).toBeUndefined();
  });
});
