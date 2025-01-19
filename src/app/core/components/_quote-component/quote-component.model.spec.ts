/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subject } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteComponent } from './quote-component.model';
import { LanguageService } from '../../services';

class TestQuoteComponent extends QuoteComponent<any> {
  public someKey = 'someValue';

  constructor() {
    super();
  }
}

describe('QuoteComponent', () => {
  let component: TestQuoteComponent;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const contextDataSubject = new Subject<any>();
    const languageSubject = new Subject<any>();
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['asObservable', 'languages', 'current', 'i18n']);

    contextDataServiceSpy.get.and.callFake((key: string): any => {
      if (key === QUOTE_CONTEXT_DATA) {
        return {
          someKey: 'someValue'
        };
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

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());
    languageServiceSpy.asObservable.and.returnValue(languageSubject.asObservable());

    TestBed.configureTestingModule({
      providers: [
        TestQuoteComponent,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: LanguageService, useValue: languageServiceSpy }
      ]
    });

    component = TestBed.inject(TestQuoteComponent);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update component data', async () => {
    await component['__updateComponentData'](component);

    expect(contextDataService.get).toHaveBeenCalledTimes(3);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
  });

  it('should load component data', () => {
    component['__updateComponentData'](component);

    expect(contextDataService.get).toHaveBeenCalledTimes(2);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
  });

  it('should load component data with context data', () => {
    contextDataService.get.and.callFake((key: string): any => {
      if (key === QUOTE_CONTEXT_DATA) {
        return {
          someKey: 'someValue',
          contextData: {
            someKey: 'someValue'
          } as Record<string, unknown>
        };
      } else if (key === QUOTE_APP_CONTEXT_DATA) {
        return {
          navigation: {
            lastPage: {
              configuration: {
                data: {
                  someKey: 'updateValue',
                  contextData: {
                    someKey: 'updateContextValue'
                  }
                }
              }
            }
          }
        } as unknown as AppContextData;
      }
    });

    component['__updateComponentData'](component);

    expect(contextDataService.get).toHaveBeenCalledTimes(2);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA);
    expect(contextDataService.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
    expect(component['_contextData']).toEqual({
      someKey: 'updateContextValue'
    } as any);
    expect(component['someKey']).toEqual('updateValue');
  });
});
