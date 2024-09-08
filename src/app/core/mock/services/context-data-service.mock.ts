import { CacheData, DataInfo } from '@shagui/ng-shagui/core';
import { Observable, of } from 'rxjs';
import { ContextDataMock } from '../models';

export class ContextDataServiceMock {
  cache: DataInfo<CacheData> = {};

  set<T>(key: string, data: T) {
    ContextDataMock[key] = data;
  }

  get<T>(key: string): T {
    return ContextDataMock[key];
  }

  delete() {
    /* Mock method */
  }

  onDataChange<T = any>(key: string): Observable<T> {
    return of(ContextDataMock[key]);
  }
}
