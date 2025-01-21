/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { FuelTypes } from 'src/app/core/models';

export interface FuelDTO {
  value: FuelTypes;
  label: string;
  additionalText?: string;
}

export namespace FuelDTO {
  export const toModel = (dto: FuelDTO): FuelModel => ({
    index: dto.value,
    data: dto.label
  });
}

export type FuelModel = IndexedData<string, FuelTypes>;
