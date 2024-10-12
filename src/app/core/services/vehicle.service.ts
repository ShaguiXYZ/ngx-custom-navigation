import { Injectable, inject } from '@angular/core';
import { HttpService, HttpStatus, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { BrandKey, CubicCapacityModel, FuelModel, IVehicleModel, ModelVersionModel, PowerRangesModel } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly _BRANCHES_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODELS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODEL_VERSIONS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly MIN_YEAR = 1950;
  private readonly vehicleUri = './assets/json/mock';

  private years: number[] = [];

  private http = inject(HttpService);

  public vehicleBrands(brand: string): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${this.vehicleUri}/brand.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheBranches(), ttl: TTL.XXL }
        })
        .pipe(map(res => (res as string[]).filter(data => data.toLowerCase().includes(brand.toLowerCase()))))
    );
  }

  public vehicleModels(brand: BrandKey, search?: string): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${this.vehicleUri}/model.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(brand), ttl: TTL.L }
        })
        .pipe(
          map(res => res as string[]),
          map(res => (!brand ? [] : res)),
          map(res => (search ? res.filter(data => data.toLowerCase().includes(search.toLowerCase())) : res))
        )
    );
  }

  public vehicleModelVersions(model: string): Promise<ModelVersionModel[]> {
    return firstValueFrom(
      this.http
        .get<ModelVersionModel[]>(`${this.vehicleUri}/version.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelVersionsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelVersionByBranch(model), ttl: TTL.L }
        })
        .pipe(
          map(res => (!model ? [] : res)),
          map(res => (res as ModelVersionModel[]).filter(data => !!data.data))
        )
    );
  }

  public modelFuels(vehicle: IVehicleModel): Promise<FuelModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<FuelModel[]>(`${this.vehicleUri}/fuel.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.FuelsNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as FuelModel[]),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public vehiclePowers(vehicle: IVehicleModel): Promise<PowerRangesModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<PowerRangesModel[]>(`${this.vehicleUri}/power.mock.json`, {
          // clientOptions: { params },
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.PowersNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as PowerRangesModel[]),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public cubicCapacities(vehicle: IVehicleModel): Promise<CubicCapacityModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<CubicCapacityModel[]>(`${this.vehicleUri}/cubic-capacity.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.CubicCapacitiesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as CubicCapacityModel[]),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public vehicles(): Promise<IVehicleModel[]> {
    return firstValueFrom(
      this.http
        .get<IVehicleModel[]>(`${this.vehicleUri}/vehicle.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.VehiclesNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as IVehicleModel[]))
    );
  }

  private cacheBranches = (): string => this._BRANCHES_CACHE_ID_;
  private cacheModelByBranch = (branch: BrandKey): string => `_${this._MODELS_CACHE_ID_}${branch}_`;
  private cacheModelVersionByBranch = (model: string): string => `_${this._MODEL_VERSIONS_CACHE_ID_}${model}_`;
}
