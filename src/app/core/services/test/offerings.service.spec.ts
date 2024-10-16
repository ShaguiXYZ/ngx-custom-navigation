import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OfferingPriceModel } from 'src/app/shared/models';
import { OfferingsService } from '../offerings.service';

describe('OfferingsService', () => {
  let service: OfferingsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [OfferingsService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(OfferingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch offerings', async () => {
    const mockOfferings: OfferingPriceModel[] = [
      { modalityId: 1, modalityDescription: 'Offering 1', totalPremiumAmount: '100' },
      { modalityId: 2, modalityDescription: 'Offering 2', totalPremiumAmount: '200' }
    ] as OfferingPriceModel[];

    httpClientSpy.get.and.returnValue(of(mockOfferings));

    service.offerings().then(offerings => {
      expect(offerings.length).toBe(2);
      expect(offerings).toEqual(mockOfferings);
    });

    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });
});
