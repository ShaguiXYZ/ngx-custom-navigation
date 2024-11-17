/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { AppContextData } from '../app-context-data.model';
import { QuoteComponent } from '../quote-component.model';

class TestQuoteComponent extends QuoteComponent {
  constructor() {
    super();
  }
}

describe('QuoteComponent', () => {
  let component: TestQuoteComponent;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);

    TestBed.configureTestingModule({
      providers: [
        TestQuoteComponent,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    });

    component = TestBed.inject(TestQuoteComponent);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_CONTEXT_DATA) {
        return component['_contextData'];
      } else if (key === QUOTE_APP_CONTEXT_DATA) {
        return {
          navigation: {
            lastPage: {
              configuration: {
                data: {}
              }
            }
          }
        } as AppContextData;
      }
      return undefined;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update component data', async () => {
    const mockAppContextData: AppContextData = {
      navigation: {
        lastPage: {
          configuration: {
            data: {
              someKey: 'someValue'
            }
          }
        }
      }
    } as unknown as AppContextData;

    contextDataService.get.and.returnValue(mockAppContextData);

    await component['__updateComponentData']();

    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
  });

  it('should update data recursively', () => {
    const data: { a: number; b: { c: number; d?: number }; e?: number } = { a: 1, b: { c: 2 } };
    const newData = { b: { c: 3, d: 4 }, e: 5 };

    component['__updateData'](data, newData);

    expect(data).toEqual({ a: 1, b: { c: 3, d: 4 }, e: 5 });
  });
});
