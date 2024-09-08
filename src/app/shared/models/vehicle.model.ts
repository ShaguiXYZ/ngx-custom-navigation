import { IndexdData } from '@shagui/ng-shagui/core';
import { FuelTypes } from './fuel-types.model';

export declare const enum VehicleTypes {
  PRIVATE_CAR = 'T',
  PRIVATE_CAR_MICRO = 'MT',
  RECREATIONAL_VEHICLE = 'AC'
}

export interface VehicleData {
  plateNumber: string;
  firstRegistrationDate: Date;
  ineCode: string;
  make: string;
  model: string;
  postalCode: string;
  vehicleCode: number;
  version: string;
  power: number;
  value: string;
  base7: number;
  type: VehicleTypes;
  fuel: IndexdData<string, FuelTypes>;
  releaseDate: Date;
}
