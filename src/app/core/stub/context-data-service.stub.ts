import { DataInfo, deepCopy } from '@shagui/ng-shagui/core';
import { Observable, of } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { AppContextData, Page } from '../models';

const appContextDataMock: AppContextData = {
  settings: {
    journey: 'journeyData',
    commercialExceptions: {}
  },
  navigation: {
    lastPage: {} as Page,
    nextPage: {} as Page,
    viewedPages: ['page1', 'page2']
  },
  configuration: {
    name: 'defaultName',
    version: { actual: 'v1.0' },
    homePageId: 'page1',
    title: 'title',
    errorPageId: 'page2',
    steppers: {
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
    },
    pageMap: {
      page1: { pageId: 'page1', component: 'route1' },
      page2: { pageId: 'page2', component: 'route2' },
      'not-show-back': { pageId: 'not-show-back', component: 'not-show-back-route1', configuration: { data: { showBack: false } } },
      'show-back': { pageId: 'show-back', component: 'show-back-route', configuration: { data: { showBack: true } } },
      page3: { pageId: 'page3', component: 'route3' }
    },
    literals: {
      key1: 'value1',
      key2: 'value2'
    }
  }
};

export class ContextDataServiceStub {
  private _contextData: DataInfo<unknown> = {
    [QUOTE_APP_CONTEXT_DATA]: deepCopy(appContextDataMock),
    [QUOTE_CONTEXT_DATA]: deepCopy({})
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
