/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { brandDictionary, BrandKey } from './brand-dictionary.model';
import { FuelTypes } from './fuel-types.model';
import { IIconData } from './icon-data.model';

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

export type IVehicleDictionaryData = Partial<IIconData>;

export class BrandData {
  private static iconType = 'png';
  private static iconPath = 'assets/images/wm/insurances/car/brands/desktop';

  public static readonly value = (key: BrandKey): IVehicleDictionaryData => ({
    ...brandDictionary[key],
    icon: this.brandIcon(key)
  });

  public static readonly allBrands = (): string[] => Object.keys(brandDictionary).sort((a, b) => a.localeCompare(b));
  public static readonly iconBrands = (): string[] =>
    this.allBrands()
      .filter(key => brandDictionary[key].icon)
      .slice(0, MAX_ICON_BRANDS);

  private static brandIcon(key: BrandKey): string | undefined {
    const icon = brandDictionary[key]?.icon;
    return icon && `${this.iconPath}/${icon}.${this.iconType}`;
  }
}

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}
