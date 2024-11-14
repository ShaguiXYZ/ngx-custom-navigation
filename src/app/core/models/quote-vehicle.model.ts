/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { brandDictionary, BrandKey, IconDictionary } from './brand-dictionary.model';
import { FuelTypes } from './fuel-types.model';

export interface FuelDTO {
  value: FuelTypes;
  label: string;
  additionalText?: string;
}

export type FuelModel = IndexedData<string, FuelTypes>;

export namespace FuelModel {
  export const fromDTO = (dto: FuelDTO): FuelModel => ({
    index: dto.value,
    data: dto.label
  });
}

export type VehicleClassesDTO<K extends string = string, T extends string = string> = `${K}.${T}`;

export type VehicleClassesModel = IndexedData;

export namespace VehicleClassesModel {
  export const fromDTO = (dto: VehicleClassesDTO): VehicleClassesModel => {
    const [K, T] = dto.split('.') as [string, string];

    return {
      index: K,
      data: T
    };
  };
}

export interface CubicCapacityDTO {
  value: string;
  label: string;
}

export type CubicCapacityModel = IndexedData;

export namespace CubicCapacityModel {
  export const fromDTO = (dto: CubicCapacityDTO): CubicCapacityModel => ({
    index: dto.value,
    data: dto.label
  });
}

export type ModelVersionModel = IndexedData<string, number>;

export const MAX_ICON_BRANDS = 12;
export const MAX_BUTTON_MODELS = 10;

interface VehicleData {
  plateNumber: string;
  firstRegistrationDate: Date;
  ineCode: string;
  make: string;
  model: string;
  postalCode: string;
  vehicleCode: string;
  version: string;
  power: number;
  value: string;
  base7: number;
  type: VehicleTypes;
  fuel: FuelModel;
  releaseDate: Date;
  powerRange?: VehicleClassesModel;
  cubicCapacity?: CubicCapacityModel;
  vehicleModelVersion?: ModelVersionModel;
}

export interface QuoteVehicleModel extends Partial<VehicleData> {
  make: string;
  yearOfManufacture?: number;
  vehicleTtype?: string;
  creationDate?: Date;
}

export namespace QuoteVehicleModel {
  export const init = (): QuoteVehicleModel =>
    ({
      make: ''
    } as QuoteVehicleModel);
}

export class BrandData {
  public static readonly iconBrands = (): string[] =>
    Object.keys(brandDictionary)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, MAX_ICON_BRANDS);

  public static readonly brandIcon = (key: BrandKey): IconDictionary => brandDictionary[key] as unknown as IconDictionary;
}

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}
