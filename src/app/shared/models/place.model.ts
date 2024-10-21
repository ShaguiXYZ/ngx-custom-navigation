/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from 'src/app/core/models';

export interface PlaceModel {
  postalCode: string;
  province?: IndexedData;
}

export namespace PlaceModel {
  export const init = (): PlaceModel => ({
    postalCode: '',
    province: undefined
  });
}
