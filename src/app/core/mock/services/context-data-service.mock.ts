import { CacheData, DataInfo, deepCopy } from '@shagui/ng-shagui/core';
import { Observable, of } from 'rxjs';
import { QuoteModel } from 'src/app/shared/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { AppContextData, Page } from '../../models';

const appContextDataMock: AppContextData = {
  navigation: {
    viewedPages: ['page1', 'page2'],
    nextPage: {} as Page
  },
  configuration: {
    homePageId: 'page1',
    steppers: {
      steppersMap: {
        stepper1: {
          steps: [
            {
              key: 'step1',
              label: { value: 'key1', type: 'translate' },
              page: 'page1'
            },
            {
              key: 'step2',
              label: 'key2',
              page: 'page2'
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

export class ContextDataServiceMock {
  private _contextData: DataInfo<any> = {
    [QUOTE_APP_CONTEXT_DATA]: deepCopy(appContextDataMock) as AppContextData,
    [QUOTE_CONTEXT_DATA]: deepCopy({}) as QuoteModel
  };
  private _cache: DataInfo<CacheData> = {};

  get cache(): DataInfo<CacheData> {
    return this._cache;
  }

  set cache(value: DataInfo<CacheData>) {
    this._cache = value;
  }

  set<T>(key: string, data: T) {
    this._contextData[key] = data;
  }

  get<T>(key: string): T {
    return this._contextData[key];
  }

  delete(key: string) {
    delete this._contextData[key];
  }

  onDataChange<T = any>(key: string): Observable<T> {
    return of(this._contextData[key]);
  }
}
