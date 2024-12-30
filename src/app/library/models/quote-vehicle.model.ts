/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { FuelTypes } from '../../core/models/fuel-types.model';

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

export namespace FuelDTO {
  export const toModel = (dto: FuelDTO): FuelModel => ({
    index: dto.value,
    data: dto.label
  });
}

export type FuelModel = IndexedData<string, FuelTypes>;

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

export type ModelVersionModel = IndexedData<string, number>;

interface VehicleData {
  plateNumber: string;
  firstRegistrationDate: Date;
  ineCode: string;
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
  modelVersion?: ModelVersionModel;
}

export interface VehicleDTO extends Partial<VehicleData> {
  make: string;
}

export namespace VehicleDTO {
  export const toModel = (dto: VehicleDTO): QuoteVehicleModel => {
    const { make, ...data } = dto;

    return {
      ...data,
      brand: make,
      model: dto.model,
      creationDate: dto.releaseDate
    };
  };
}

export interface QuoteVehicleModel extends Partial<VehicleData> {
  brand?: string;
  yearOfManufacture?: number;
  vehicleType?: string;
  creationDate?: Date;
  notFound?: boolean;
}

export namespace QuoteVehicleModel {
  export const init = (): QuoteVehicleModel => ({});
}
