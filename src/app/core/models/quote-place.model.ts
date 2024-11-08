/* eslint-disable @typescript-eslint/no-namespace */
import { LocationModel } from 'src/app/core/models';

export type QuotePlaceModel = Partial<LocationModel>;

export namespace QuotePlaceModel {
  export const init = (): QuotePlaceModel => ({});
}
