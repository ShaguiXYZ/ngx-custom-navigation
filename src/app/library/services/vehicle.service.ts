import { HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HttpService, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpError } from '../../core/errors';
import { ModelVersionModel, QuoteVehicleModel, VehicleDTO } from '../models';
import {
  BrandDTO,
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  VehicleClassesDTO,
  VehicleClassesModel,
  VehicleModelDTO
} from '../models/vehicle';

const DEFAULT_YEAR = new Date().getFullYear();

@Injectable()
export class VehicleService {
  private readonly _BRANCHES_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODELS_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly _MODEL_VERSIONS_CACHE_ID_ = `_${UniqueIds.next()}_`;

  // private readonly VEHICLE_API = environment.baseUrl;
  private readonly VEHICLE_API = '/api';

  private http = inject(HttpService);

  public findByPlate(plate: string): Promise<QuoteVehicleModel[]> {
    if (!plate?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ plate });

    return firstValueFrom(
      this.http
        .get<VehicleDTO[]>(`${environment.baseUrl}/plate`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehicleNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as VehicleDTO[]),
          // map(res => res.find(data => data.plateNumber === plate.toLocaleUpperCase().replace(/[^A-Z0-9]/g, ''))),
          map(res => res.map(VehicleDTO.toModel))
        )
    );
  }

  public vehicles(): Promise<QuoteVehicleModel[]> {
    return firstValueFrom(
      this.http
        .get<VehicleDTO[]>(`${environment.baseUrl}/vehicle`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehiclesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as VehicleDTO[]),
          map(res => res.map(VehicleDTO.toModel))
        )
    );
  }

  public getBrands(make?: string, year: number = DEFAULT_YEAR): Promise<string[]> {
    const httpParams = new HttpParams();

    if (make?.trim()) {
      httpParams.set('make', make);
    }

    if (year) {
      httpParams.set('year', year.toString());
    }

    return firstValueFrom(
      this.http
        .get<BrandDTO>(`${this.VEHICLE_API}/makes`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.BrandsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheBrands(year), ttl: TTL.XXL }
        })
        .pipe(
          map(res => res as BrandDTO),
          map(res => res.data.map(data => data.name)),
          map(res => (make ? res.filter(data => data.toUpperCase().includes(make.toUpperCase())) : res)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public getModels(make: string, search?: string, year = 2020): Promise<string[]> {
    if (!make?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ make, year });
    return firstValueFrom(
      this.http
        .get<VehicleModelDTO>(`${this.VEHICLE_API}/models`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelByBranch(make, year), ttl: TTL.L }
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText, error.url, error.method);
          }),
          map(res => res as VehicleModelDTO),
          map(res => (!make ? [] : res.data)),
          map(res => (search ? res.filter(data => data.name.toLowerCase().includes(search.toLowerCase())) : res)),
          map(res => res.map(data => data.name)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public vehicleModelVersions(model: string): Promise<ModelVersionModel[]> {
    if (!model?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ model });

    return firstValueFrom(
      this.http
        .get<ModelVersionModel[]>(`${environment.baseUrl}/version`, {
          clientOptions: { params: httpParams },
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
    const { brand, model } = vehicle;
    const httpParams = new HttpParams().appendAll({ brand: brand || '', model: model || '' });

    return firstValueFrom(
      this.http
        .get<FuelDTO[]>(`${environment.baseUrl}/fuel`, {
          clientOptions: { params: httpParams },
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
          map(res => res.map(FuelDTO.toModel)),
          map(res => (!brand || !model ? [] : res))
        )
    );
  }

  public cubicCapacities(vehicle: QuoteVehicleModel): Promise<CubicCapacityModel[]> {
    const { brand, model } = vehicle;
    const httpParams = new HttpParams().appendAll({ brand: brand || '', model: model || '' });

    return firstValueFrom(
      this.http
        .get<CubicCapacityDTO[]>(`${environment.baseUrl}/cubic-capacity`, {
          clientOptions: { params: httpParams },
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
          map(res => res.map(CubicCapacityDTO.toModel)),
          map(res => (!brand || !model ? [] : res))
        )
    );
  }

  public getVehicleClasses(vehicle: QuoteVehicleModel): Promise<VehicleClassesModel[]> {
    const { brand, model } = vehicle;
    const httpParams = new HttpParams().appendAll({ brand: brand || '', model: model || '' });

    return firstValueFrom(
      this.http
        .get<VehicleClassesDTO[]>(`${environment.baseUrl}/power`, {
          clientOptions: { params: httpParams },
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
          map(res => res.map(VehicleClassesDTO.toModel)),
          map(res => (!brand || !model ? [] : res))
        )
    );
  }

  private cacheBrands = (year: number): string => `${this._BRANCHES_CACHE_ID_}${year}_`;
  private cacheModelByBranch = (branch: string, year: number): string => `_${this._MODELS_CACHE_ID_}${branch}_${year}_`;
  private cacheModelVersionByBranch = (model: string): string => `_${this._MODEL_VERSIONS_CACHE_ID_}${model}_`;
}
