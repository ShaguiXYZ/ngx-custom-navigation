import { HttpParams, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { hasValue, HttpService, TTL } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QuoteVehicleModel, VehicleDTO } from '../models';
import { _BRANCHES_CACHE_ID_, _MODEL_VERSIONS_CACHE_ID_, _MODELS_CACHE_ID_, _SUBMODELS_CACHE_ID_ } from '../models/constants';
import {
  BrandDTO,
  CubicCapacityDTO,
  CubicCapacityModel,
  FuelDTO,
  FuelModel,
  ModelVersionModel,
  VehicleClassesDTO,
  VehicleClassesModel,
  VehicleModelDTO,
  VehicleSubmodelDTO
} from '../models/vehicle';

const DEFAULT_YEAR = new Date().getFullYear();
// const VEHICLE_API = environment.baseUrl;
const VEHICLE_API = '/api';

@Injectable()
export class VehicleService {
  private http = inject(HttpService);

  public findByPlate(plate: string): Promise<QuoteVehicleModel[]> {
    if (!plate?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ plate });

    return firstValueFrom(
      this.http
        .get<VehicleDTO[]>(`${environment.mockUrl}/plate`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehicleNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as VehicleDTO[]),
          map(res => res.filter(data => data.plateNumber === plate.toLocaleUpperCase().replace(/[^A-Z0-9]/g, ''))),
          map(res => res.map(VehicleDTO.toModel))
        )
    );
  }

  public vehicles(): Promise<QuoteVehicleModel[]> {
    return firstValueFrom(
      this.http
        .get<VehicleDTO[]>(`${environment.mockUrl}/vehicle`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.VehiclesNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as VehicleDTO[]),
          map(res => res.map(VehicleDTO.toModel))
        )
    );
  }

  public getBrands(search?: string, year: number = DEFAULT_YEAR): Promise<string[]> {
    let httpParams = new HttpParams();

    if (hasValue(search)) {
      httpParams = httpParams.append('make', search);
    }

    if (hasValue(year)) {
      httpParams = httpParams.append('year', year.toString());
    }

    return firstValueFrom(
      this.http
        .get<BrandDTO>(`${VEHICLE_API}/makes/v2`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.BrandsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheBrands(year), ttl: TTL.L }
        })
        .pipe(
          map(res => res as BrandDTO),
          map(res => res.data.map(data => data.name)),
          map(res => (search ? res.filter(data => data.toUpperCase().includes(search.toUpperCase())) : res)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public getModels(make: string, search?: string, year = DEFAULT_YEAR): Promise<string[]> {
    if (!make?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ make, year });
    return firstValueFrom(
      this.http
        .get<VehicleModelDTO>(`${VEHICLE_API}/models/v2`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModel(make, year), ttl: TTL.L }
        })
        .pipe(
          map(res => res as VehicleModelDTO),
          map(res => (!make ? [] : res.data)),
          map(res => (search ? res.filter(data => data.name.toLowerCase().includes(search.toLowerCase())) : res)),
          map(res => res.map(data => data.name)),
          map(res => res.sort((a, b) => a.localeCompare(b)))
        )
    );
  }

  public getSubmodels(make: string, model: string, search?: string, year = DEFAULT_YEAR): Promise<ModelVersionModel[]> {
    if (!make?.trim() || !model?.trim()) {
      return Promise.resolve([]);
    }
    const httpParams = new HttpParams().appendAll({ make, model, year });

    return firstValueFrom(
      this.http
        .get<VehicleSubmodelDTO>(`${VEHICLE_API}/submodels/v2`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.SubmodelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheSubmodel(make, model, year), ttl: TTL.L }
        })
        .pipe(
          map(res => res as VehicleSubmodelDTO),
          map(res => (!make || !model ? [] : res.data)),
          map(res =>
            res.reduce<ModelVersionModel[]>((acc, data) => {
              const submodel = data.submodel.trim();
              if (submodel) {
                acc.push({
                  data: submodel
                    .replace(/[^A-Z0-9]/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .toUpperCase(),
                  index: data.id
                });
              }
              return acc;
            }, [])
          ),
          map(res => (search ? res.filter(submodel => submodel.data.toLowerCase().includes(search.toLowerCase())) : res))
        )
    );
  }

  public vehicleModelVersions(model: string, search?: string): Promise<ModelVersionModel[]> {
    if (!model?.trim()) {
      return Promise.resolve([]);
    }

    const httpParams = new HttpParams().appendAll({ model });

    return firstValueFrom(
      this.http
        .get<ModelVersionModel[]>(`${environment.mockUrl}/version`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelVersionsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheModelVersionByBranch(model), ttl: TTL.L }
        })
        .pipe(
          map(res => (!model ? [] : res)),
          map(res => (res as ModelVersionModel[]).filter(data => !!data.data)),
          map(res => (search ? res.filter(data => data.data.toLowerCase().includes(search.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.data.localeCompare(b.data)))
        )
    );
  }

  public getFuelTypes(vehicle: QuoteVehicleModel): Promise<FuelModel[]> {
    const { brand, model } = vehicle;
    const httpParams = new HttpParams().appendAll({ brand: brand || '', model: model || '' });

    return firstValueFrom(
      this.http
        .get<FuelDTO[]>(`${environment.mockUrl}/fuel`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.FuelsNotFound' }
          },
          showLoading: true
        })
        .pipe(
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
        .get<CubicCapacityDTO[]>(`${environment.mockUrl}/cubic-capacity`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.CubicCapacitiesNotFound' }
          },
          showLoading: true
        })
        .pipe(
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
        .get<VehicleClassesDTO[]>(`${environment.mockUrl}/power`, {
          clientOptions: { params: httpParams },
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.PowersNotFound' }
          },
          showLoading: true
        })
        .pipe(
          map(res => res as VehicleClassesDTO[]),
          map(res => res.map(VehicleClassesDTO.toModel)),
          map(res => (!brand || !model ? [] : res))
        )
    );
  }

  private cacheBrands = (year: number): string => `${_BRANCHES_CACHE_ID_}${year}_`;
  private cacheModel = (branch: string, year: number): string => `_${_MODELS_CACHE_ID_}${branch}_${year}_`;
  private cacheSubmodel = (branch: string, model: string, year: number): string => `_${_SUBMODELS_CACHE_ID_}${branch}_${model}_${year}_`;
  private cacheModelVersionByBranch = (model: string): string => `_${_MODEL_VERSIONS_CACHE_ID_}${model}_`;
}
