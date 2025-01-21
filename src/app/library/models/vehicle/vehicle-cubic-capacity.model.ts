/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';

export interface CubicCapacityDTO {
  value: string;
  label: string;
}

export namespace CubicCapacityDTO {
  export const toModel = (dto: CubicCapacityDTO): CubicCapacityModel => ({
    index: dto.value,
    data: dto.label
  });
}

export type CubicCapacityModel = IndexedData;
