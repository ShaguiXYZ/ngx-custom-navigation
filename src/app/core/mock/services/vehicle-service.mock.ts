import { BrandKey, FuelModel, IVehicleModel, PowerRangesModel } from 'src/app/shared/models';

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
