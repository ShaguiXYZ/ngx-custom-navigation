/* eslint-disable @typescript-eslint/no-namespace */

import { CubicCapacityModel, ModelVersionModel, VehicleClassesModel } from './vehicle';
import { FuelModel } from './vehicle/vehicle-fuel.model';

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}

export interface VehicleDTO {
  make: string;
  plateNumber?: string;
  firstRegistrationDate?: Date;
  ineCode?: string;
  model?: string;
  postalCode?: string;
  vehicleCode?: string;
  version?: string;
  power?: number;
  value?: string;
  base7?: number;
  type?: VehicleTypes;
  fuel?: FuelModel;
  releaseDate?: Date;
  powerRange?: VehicleClassesModel;
  cubicCapacity?: CubicCapacityModel;
  modelVersion?: ModelVersionModel;
}

export namespace VehicleDTO {
  export const toModel = (dto: VehicleDTO): QuoteVehicleModel => {
    const { make: brand, releaseDate: creationDate, ...data } = dto;

    return {
      ...data,
      brand,
      model: dto.model,
      creationDate
    };
  };
}

export interface QuoteVehicleModel {
  brand?: string;
  yearOfManufacture?: number;
  vehicleType?: string;
  vehicleParkingType?: string;
  creationDate?: Date;
  plateNumber?: string;
  firstRegistrationDate?: Date;
  ineCode?: string;
  model?: string;
  postalCode?: string;
  vehicleCode?: string;
  version?: string;
  power?: number;
  value?: string;
  base7?: number;
  type?: VehicleTypes;
  fuel?: FuelModel;
  powerRange?: VehicleClassesModel;
  cubicCapacity?: CubicCapacityModel;
  modelVersion?: ModelVersionModel;
  notFound?: boolean;
}

export namespace QuoteVehicleModel {
  export const init = (): QuoteVehicleModel => ({});
}
