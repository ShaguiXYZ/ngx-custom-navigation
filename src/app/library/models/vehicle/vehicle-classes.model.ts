/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';

export type VehicleClassesDTO<K extends string = string, T extends string = string> = `${K}.${T}`;

export namespace VehicleClassesDTO {
  export const toModel = (dto: VehicleClassesDTO): VehicleClassesModel => {
    const [K, T] = dto.split('.') as [string, string];

    return {
      index: K,
      data: T
    };
  };
}

export type VehicleClassesModel = IndexedData;
