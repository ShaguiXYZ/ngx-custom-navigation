/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { HttpService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { OfferingDTO } from 'src/app/core/models';
import { QuoteModel } from '../../models';
import { OfferingsService } from '../offerings.service';
import { ServiceActivatorService } from 'src/app/core/service-activators';

describe('OfferingsService', () => {
  let service: OfferingsService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let serviceActivatorSpy: jasmine.SpyObj<ServiceActivatorService>;

  beforeEach(() => {
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    httpServiceSpy = jasmine.createSpyObj('HttpService', ['get', 'post', 'put', 'delete']);
    serviceActivatorSpy = jasmine.createSpyObj('ServiceActivatorService', ['activateEntryPoint']);
    serviceActivatorSpy.activateEntryPoint.and.resolveTo(undefined);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        OfferingsService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: ServiceActivatorService, useValue: serviceActivatorSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
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
          {
            modalityId: 1,
            modalityDescription: 'Offering 1',
            totalPremiumAmount: '100',
            receiptData: { firstReceiptAmount: 100, followingReceiptAmount: 50 },
            coverageList: [],
            configurableCoverageList: []
          },
          {
            modalityId: 2,
            modalityDescription: 'Offering 2',
            totalPremiumAmount: '200',
            receiptData: { firstReceiptAmount: 200, followingReceiptAmount: 100 },
            coverageList: [],
            configurableCoverageList: []
          }
        ]
      }
    } as unknown as OfferingDTO;

    httpServiceSpy.get.and.returnValue(of(mockOfferings));
    httpServiceSpy.post.and.returnValue(of(mockOfferings));

    const offerings = await service.pricing({
      client: {},
      contactData: {},
      driven: {},
      insuranceCompany: {},
      offering: {},
      personalData: {},
      place: {},
      vehicle: {},
      signature: { hash: 'hash' }
    } as unknown as QuoteModel);

    expect(offerings.prices?.length).toBe(2);
    expect(offerings.prices?.[0].modalityId).toBe(1);
    expect(offerings.prices?.[0].modalityDescription).toBe('Offering 1');

    expect(httpServiceSpy.get.calls.count()).withContext('one call').toBe(1);
    expect(httpServiceSpy.post.calls.count()).withContext('one call').toBe(1);
  });

  it('should return cached offerings when quote does not change', async () => {
    const offerings = await service.pricing({
      signature: { hash: 'hash' },
      offering: {
        hash: 'hash',
        prices: [
          { modalityId: 1, modalityDescription: 'Offering 1', totalPremiumAmount: '100' },
          { modalityId: 2, modalityDescription: 'Offering 2', totalPremiumAmount: '200' }
        ]
      }
    } as unknown as QuoteModel);

    expect(offerings.prices?.length).toBe(2);
    expect(httpServiceSpy.get.calls.count()).withContext('no calls').toBe(0);
  });
});
