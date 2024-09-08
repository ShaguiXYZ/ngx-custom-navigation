import { HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService, HttpStatus, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { BrandKey, FuelModel, IVehicleModel, PowerRangesModel } from '../../shared/components/vehicle-selection';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly _MODELS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly MIN_YEAR = 1950;

  private vehicleUri = './assets/json/mock';

  private http = inject(HttpService);

  private years: number[] = [];

  public vehicleBrands(branch: BrandKey): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${this.vehicleUri}/brand.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(branch), ttl: TTL.L }
        })
        .pipe(map(res => res as string[]))
    );
  }

  public vehicleModels(brand: BrandKey): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${this.vehicleUri}/model.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(brand), ttl: TTL.L }
        })
        .pipe(map(res => res as string[]))
    );
  }

  public modelFuels(vehicle: IVehicleModel): Promise<FuelModel[]> {
    const params = new HttpParams().appendAll({
      brand: vehicle.make,
      model: vehicle.model!
    });

    return firstValueFrom(
      this.http
        .get<FuelModel[]>(`${this.vehicleUri}/fuel.mock.json`, {
          clientOptions: { params },
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.FuelsNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as FuelModel[]))
    );
  }

  public vehiclePowers(vehicle: IVehicleModel): Promise<PowerRangesModel[]> {
    const params = new HttpParams().appendAll({
      brand: vehicle.make,
      model: vehicle.model!
    });

    return firstValueFrom(
      this.http
        .get<PowerRangesModel[]>(`${this.vehicleUri}/power.mock.json`, {
          clientOptions: { params },
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.PowersNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as PowerRangesModel[]))
    );
  }

  public getYears(): Promise<number[]> {
    if (!this.years.length) {
      let year = new Date().getFullYear();
      const length = year > this.MIN_YEAR ? year++ - this.MIN_YEAR : 0;
      this.years = new Array(length);
      let i = -1;

      while (i < length) {
        this.years[++i] = --year;
      }
    }

    return Promise.resolve(this.years);
  }
  private cacheModelByBranch = (branch: BrandKey): string => `${this._MODELS_CACHE_ID_}${branch}_`;
}
