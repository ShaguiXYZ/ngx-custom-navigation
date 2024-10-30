import { Injectable, inject } from '@angular/core';
import { HttpService, HttpStatus, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import {
  BrandKey,
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  ModelVersionModel,
  QuoteVehicleModel,
  VehicleClassesDTO,
  VehicleClassesModel
} from 'src/app/shared/models';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly _BRANCHES_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODELS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODEL_VERSIONS_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private years: number[] = [];

  private http = inject(HttpService);

  public findByPlate(plate: string): Promise<QuoteVehicleModel | undefined> {
    return firstValueFrom(
      this.http
        .get<QuoteVehicleModel[]>(`${environment.baseUrl}/plate`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.VehicleNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as QuoteVehicleModel[]),
          map(res => res.find(data => data.plateNumber === plate.toLocaleUpperCase().replace(/[^A-Z0-9]/g, '')))
        )
    );
  }

  public getBrands(brand: string): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${environment.baseUrl}/brand`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheBranches(), ttl: TTL.XXL }
        })
        .pipe(
          map(res => (res as string[]).filter(data => data.toLowerCase().includes(brand.toLowerCase()))),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public getModels(brand: BrandKey, search?: string): Promise<string[]> {
    return firstValueFrom(
      this.http
        .get<string[]>(`${environment.baseUrl}/model`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(brand), ttl: TTL.L }
        })
        .pipe(
          map(res => res as string[]),
          map(res => (!brand ? [] : res)),
          map(res => (search ? res.filter(data => data.toLowerCase().includes(search.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public vehicleModelVersions(model: string): Promise<ModelVersionModel[]> {
    return firstValueFrom(
      this.http
        .get<ModelVersionModel[]>(`${environment.baseUrl}/version`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelVersionsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelVersionByBranch(model), ttl: TTL.L }
        })
        .pipe(
          map(res => (!model ? [] : res)),
          map(res => (res as ModelVersionModel[]).filter(data => !!data.data)),
          map(res => res.sort((a, b) => a.data.localeCompare(b.data)))
        )
    );
  }

  public getFuelTypes(vehicle: QuoteVehicleModel): Promise<FuelModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<FuelDTO[]>(`${environment.baseUrl}/fuel`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.FuelsNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as FuelDTO[]),
          map(res => res.map(FuelModel.fromDTO)),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public cubicCapacities(vehicle: QuoteVehicleModel): Promise<CubicCapacityModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<CubicCapacityDTO[]>(`${environment.baseUrl}/cubic-capacity`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.CubicCapacitiesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as CubicCapacityDTO[]),
          map(res => res.map(CubicCapacityModel.fromDTO)),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public getVehicleClasses(vehicle: QuoteVehicleModel): Promise<VehicleClassesModel[]> {
    const { make, model } = vehicle;

    return firstValueFrom(
      this.http
        .get<VehicleClassesDTO[]>(`${environment.baseUrl}/power`, {
          // clientOptions: { params },
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.PowersNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as VehicleClassesDTO[]),
          map(res => res.map(VehicleClassesModel.fromDTO)),
          map(res => (!make || !model ? [] : res))
        )
    );
  }

  public vehicles(): Promise<QuoteVehicleModel[]> {
    return firstValueFrom(
      this.http
        .get<QuoteVehicleModel[]>(`${environment.baseUrl}/vehicle`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.VehiclesNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as QuoteVehicleModel[]))
    );
  }

  private cacheBranches = (): string => this._BRANCHES_CACHE_ID_;
  private cacheModelByBranch = (branch: BrandKey): string => `_${this._MODELS_CACHE_ID_}${branch}_`;
  private cacheModelVersionByBranch = (model: string): string => `_${this._MODEL_VERSIONS_CACHE_ID_}${model}_`;
}
