/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';

export interface QuotePlaceModel {
  postalCode: string;
  province?: IndexedData;
}

export namespace QuotePlaceModel {
  export const init = (): QuotePlaceModel => ({
    postalCode: '',
    province: undefined
  });
}
