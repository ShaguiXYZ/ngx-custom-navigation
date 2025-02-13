import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocationModel } from '../../models';
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

  it('should fetch address by postal code', async () => {
    const mockLocationResponse = { province: '01', code: '234', location: 'LocationName' };
    const postalCode = '01234';

    httpClientSpy.get.and.returnValue(of(mockLocationResponse));

    const result = await service.getAddress(postalCode);

    expect(result).toEqual(LocationModel.create(postalCode, mockLocationResponse.province, mockLocationResponse.location));
  });

  it('should return undefined if postal code not found', async () => {
    const postalCode = '01234';

    httpClientSpy.get.and.throwError('Error fetching location');

    service.getAddress(postalCode).then(result => {
      expect(result).toBeUndefined();
    });
  });
});
