import { DataInfo, deepCopy } from '@shagui/ng-shagui/core';
import { Observable, of } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, Page, QuoteModel } from '../models';

const appContextDataMock: AppContextData = {
  navigation: {
    viewedPages: ['page1', 'page2'],
    nextPage: {} as Page
  },
  configuration: {
    homePageId: 'page1',
    errorPageId: 'page2',
    steppers: {
      steppersMap: {
        stepper1: {
          steps: [
            {
              key: 'step1',
              label: 'key1',
              pages: ['page1']
            },
            {
              key: 'step2',
              label: 'key2',
              pages: ['page2']
            }
          ]
        }
      }
    },
    pageMap: {
      page1: { pageId: 'page1', route: 'route1' },
      page2: { pageId: 'page2', route: 'route2' },
      'not-show-back': { pageId: 'not-show-back', route: 'not-show-back-route1', configuration: { data: { showBack: false } } },
      'show-back': { pageId: 'show-back', route: 'show-back-route', configuration: { data: { showBack: true } } },
      page3: { pageId: 'page3', route: 'route3' }
    },
    literals: {
      key1: 'value1',
      key2: 'value2'
    }
  }
};

export class ContextDataServiceStub {
  private _contextData: DataInfo<unknown> = {
    [QUOTE_APP_CONTEXT_DATA]: deepCopy(appContextDataMock) as AppContextData,
    [QUOTE_CONTEXT_DATA]: deepCopy({}) as QuoteModel
  };

  set<T = unknown>(key: string, data: T) {
    this._contextData[key] = data;
  }

  get<T = unknown>(key: string): T {
    return this._contextData[key] as T;
  }

  onDataChange<T = unknown>(key: string): Observable<T> {
    return of(this._contextData[key] as T);
  }
}
