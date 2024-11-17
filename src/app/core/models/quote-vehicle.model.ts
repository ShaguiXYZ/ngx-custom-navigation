/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { FuelTypes } from './fuel-types.model';

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}

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
  make?: string;
  yearOfManufacture?: number;
  vehicleType?: string;
  creationDate?: Date;
}

export namespace QuoteVehicleModel {
  export const init = (): QuoteVehicleModel => ({});
}
