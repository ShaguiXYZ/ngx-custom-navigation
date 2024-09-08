/* eslint-disable @typescript-eslint/no-unused-vars */

import { BrandKey, FuelModel, IVehicleModel, PowerRangesModel } from '../../../shared/components/vehicle-selection';

export class VehicleServiceMock {
  vehicleBrands(branch: BrandKey): Promise<string[]> {
    return Promise.resolve([]);
  }

  vehicleModels(brand: BrandKey): Promise<string[]> {
    return Promise.resolve([]);
  }

  modelFuels(vehicle: IVehicleModel): Promise<FuelModel[]> {
    return Promise.resolve([]);
  }

  vehiclePowers(vehicle: IVehicleModel): Promise<PowerRangesModel[]> {
    return Promise.resolve([]);
  }

  getYears(): Promise<number[]> {
    return Promise.resolve([]);
  }
}
