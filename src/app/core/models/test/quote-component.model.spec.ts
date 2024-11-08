import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from '../../constants';
import { QuoteService } from '../../services/quote.service';
import { QuoteComponent } from '../quote-component.model';
import { QuoteModel } from '../quote.model';

class MockQuoteService {
  loadComponentData = jasmine.createSpy('loadComponentData').and.returnValue(Promise.resolve());
}

class MockContextDataService {
  private data: Record<string, unknown> = {};

  get<T>(key: string): T {
    return this.data[key] as T;
  }

  set<T>(key: string, value: T): void {
    this.data[key] = value;
  }
}

describe('QuoteComponent', () => {
  let component: QuoteComponent;
  let quoteService: MockQuoteService;
  let contextDataService: MockContextDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: QuoteService, useClass: MockQuoteService },
        { provide: ContextDataService, useClass: MockContextDataService },
        QuoteComponent
      ]
    });

    component = TestBed.inject(QuoteComponent);
    quoteService = TestBed.inject(QuoteService) as unknown as MockQuoteService;
    contextDataService = TestBed.inject(ContextDataService) as unknown as MockContextDataService;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadComponentData on initialization', async () => {
    await component['updateComponentData']();

    expect(quoteService.loadComponentData).toHaveBeenCalledWith(component);
  });

  it('should populate context data', () => {
    const mockData: QuoteModel = {
      client: {
        /* mock QuoteClientModel data */
      },
      contactData: {
        /* mock QuoteContactDataModel data */
      },
      driven: {
        /* mock QuoteDrivenModel data */
      },
      insuranceCompany: {
        /* mock QuoteInsuranceCompanyModel data */
      },
      offering: { quotationId: 123 /* mock QuoteOfferingModel data */ },
      personalData: { name: 'John Doe' /* mock QuotePersonalDataModel data */ },
      place: {
        /* mock QuotePlaceModel data */
      },
      vehicle: { make: 'Toyota' /* mock QuoteVehicleModel data */ }
    };

    component['contextData'] = mockData;
    component['populateContextData']();

    expect(contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA)).toEqual(mockData);
  });
});
