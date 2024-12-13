import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OfferingDTO, QuoteModel } from '../../models';
import { OfferingsService } from '../offerings.service';
import { ContextDataService } from '@shagui/ng-shagui/core';

describe('OfferingsService', () => {
  let service: OfferingsService;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    contextDataServiceSpy.get.and.returnValue({ settings: { agent: '1234' } });

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OfferingsService,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(OfferingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch offerings when quote changes', async () => {
    const mockOfferings: OfferingDTO = {
      operationData: {
        priceGrid: [
          { modalityId: 1, modalityDescription: 'Offering 1', totalPremiumAmount: '100' },
          { modalityId: 2, modalityDescription: 'Offering 2', totalPremiumAmount: '200' }
        ]
      }
    } as OfferingDTO;

    httpClientSpy.post.and.returnValue(of(mockOfferings));

    service
      .pricing({
        client: {},
        contactData: {},
        driven: {},
        insuranceCompany: {},
        offering: {},
        personalData: {},
        place: {},
        vehicle: {},
        signature: { hash: 'hash' }
      } as QuoteModel)
      .then(offerings => {
        expect(offerings.prices.length).toBe(2);
        expect(offerings.prices[0].modalityId).toBe(1);
        expect(offerings.prices[0].modalityDescription).toBe('Offering 1');
      });

    expect(httpClientSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  it('should return cached offerings when quote does not change', async () => {
    service
      .pricing({
        signature: { hash: 'hash' },
        offering: {
          hash: 'hash',
          prices: [
            { modalityId: 1, modalityDescription: 'Offering 1', totalPremiumAmount: '100' },
            { modalityId: 2, modalityDescription: 'Offering 2', totalPremiumAmount: '200' }
          ]
        }
      } as unknown as QuoteModel)
      .then(offerings => {
        expect(offerings.prices.length).toBe(2);
      });

    expect(httpClientSpy.get.calls.count()).withContext('no calls').toBe(0);
  });
});
