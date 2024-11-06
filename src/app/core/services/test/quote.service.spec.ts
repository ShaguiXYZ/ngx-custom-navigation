import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteComponent } from '../../models';
import { QuoteService } from '../quote.service';

describe('QuoteService', () => {
  let service: QuoteService;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);

    TestBed.configureTestingModule({
      providers: [QuoteService, { provide: ContextDataService, useValue: contextDataServiceSpy }]
    });
    service = TestBed.inject(QuoteService);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update component data', () => {
    const appContextData = { key1: 'value1', key2: 'value2' };
    const component = {
      key1: 'value2',
      key2: 'value3',
      contextData: appContextData,
      quoteService: service,
      contextDataService,
      populateContextData: jasmine.createSpy('populateContextData'),
      someOtherProperty: 'someValue'
    };

    contextDataService.get.and.returnValue({ navigation: { lastPage: { configuration: { data: { key1: 'value1', key2: 'value2' } } } } });

    service.loadComponentData(component as unknown as QuoteComponent);

    expect(component.key1).toBe('value1');
    expect(component.key2).toBe('value2');
  });

  it('should update component contextData', () => {
    const appContextData = { object1: { 'o-value1': 'value1', 'o-value2': 'value2' }, key2: 'value2' };
    const component = {
      key1: 'value2',
      key2: 'value3',
      contextData: appContextData,
      quoteService: service,
      contextDataService,
      populateContextData: jasmine.createSpy('populateContextData'),
      someOtherProperty: 'someValue'
    };

    contextDataService.get.and.returnValue({
      navigation: { lastPage: { configuration: { data: { contextData: { object1: { 'o-value1': 'value-updated' } } } } } }
    });

    service.loadComponentData(component as unknown as QuoteComponent);

    expect(component.contextData).toEqual({ object1: { 'o-value1': 'value-updated', 'o-value2': 'value2' }, key2: 'value2' });
  });
});
