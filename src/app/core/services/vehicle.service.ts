import { HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpError } from '../errors';
import {
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  ModelVersionModel,
  QuoteVehicleModel,
  VehicleClassesDTO,
  VehicleClassesModel
} from '../models';

@Injectable()
export class VehicleService {
  private readonly _BRANCHES_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODELS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODEL_VERSIONS_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private http = inject(HttpService);

  public findByPlate(plate: string): Promise<QuoteVehicleModel | undefined> {
    if (!plate?.trim()) {
      return Promise.resolve({});
    }

    return firstValueFrom(
      this.http
        .get<QuoteVehicleModel[]>(`${environment.baseUrl}/plate`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehicleNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as QuoteVehicleModel[]),
          map(res => res.find(data => data.plateNumber === plate.toLocaleUpperCase().replace(/[^A-Z0-9]/g, '')))
        )
    );
  }

  public getBrands(brand?: string): Promise<string[]> {
    if (!brand?.trim()) {
      return Promise.resolve([]);
    }

    return firstValueFrom(
      this.http
        .get<string[]>(`${environment.baseUrl}/brand`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.BrandsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheBrands(), ttl: TTL.XXL }
        })
        .pipe(
          map(res => res as string[]),
          map(res => (brand ? res.filter(data => data.toLowerCase().includes(brand.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public getModels(brand: string, search?: string): Promise<string[]> {
    if (!brand?.trim()) {
      return Promise.resolve([]);
    }

    return firstValueFrom(
      this.http
        .get<string[]>(`${environment.baseUrl}/model`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(brand), ttl: TTL.L }
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as string[]),
          map(res => (!brand ? [] : res)),
          map(res => (search ? res.filter(data => data.toLowerCase().includes(search.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public vehicleModelVersions(model: string): Promise<ModelVersionModel[]> {
    if (!model?.trim()) {
      return Promise.resolve([]);
    }

    return firstValueFrom(
      this.http
        .get<ModelVersionModel[]>(`${environment.baseUrl}/version`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelVersionsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelVersionByBranch(model), ttl: TTL.L }
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
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
            [HttpStatusCode.NotFound]: { text: 'Notifications.FuelsNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
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
            [HttpStatusCode.NotFound]: { text: 'Notifications.CubicCapacitiesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
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
            [HttpStatusCode.NotFound]: { text: 'Notifications.PowersNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
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
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehiclesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as QuoteVehicleModel[])
        )
    );
  }

  private cacheBrands = (): string => this._BRANCHES_CACHE_ID_;
  private cacheModelByBranch = (branch: string): string => `_${this._MODELS_CACHE_ID_}${branch}_`;
  private cacheModelVersionByBranch = (model: string): string => `_${this._MODEL_VERSIONS_CACHE_ID_}${model}_`;
}
