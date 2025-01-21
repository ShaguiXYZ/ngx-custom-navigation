/* eslint-disable @typescript-eslint/no-namespace */
import { IndexedData } from '@shagui/ng-shagui/core';
import { CubicCapacityModel, VehicleClassesModel } from './vehicle';
import { FuelModel } from './vehicle/vehicle-fuel.model';

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}

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
  powerRange: VehicleClassesModel;
  cubicCapacity: CubicCapacityModel;
  modelVersion: ModelVersionModel;
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
  vehicleParkingType?: string;
  creationDate?: Date;
  notFound?: boolean;
}

export namespace QuoteVehicleModel {
  export const init = (): QuoteVehicleModel => ({});
}
