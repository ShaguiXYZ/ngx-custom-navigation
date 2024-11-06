import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataInfo, HttpService, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationDTO, LocationModel } from '../models';
import { HttpError } from '../errors';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly _PROVINCES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private readonly httpService = inject(HttpService);

  public getProvince = (provinceCode: string): Promise<string> => {
    return firstValueFrom(
      this.httpService
        .get<DataInfo>(`${environment.baseUrl}/provinces`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ProvinceNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheProvinces(), ttl: TTL.XXL }
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText);
          }),
          map(res => res as DataInfo),
          map(res => res[provinceCode])
        )
    );
  };

  public getAddress = async (postalCode: string): Promise<LocationModel | undefined> => {
    if (!/^\d{5}$/.test(postalCode)) {
      return undefined;
    }

    const [provinceCode, locationCode] = [postalCode.slice(0, 2), postalCode.slice(2)];

    try {
      const province = await this.getProvince(provinceCode);

      if (!province) {
        return undefined;
      }

      const locations = await firstValueFrom(
        this.httpService
          .get<LocationDTO[]>(`${environment.baseUrl}/locations`, {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(
            catchError(error => {
              throw new HttpError(error.status, error.statusText);
            }),
            map(res => res as LocationDTO[])
          )
      );

      const location = locations.find(data => data.province === provinceCode && data.code === locationCode);

      return location ? LocationModel.create(`${location.province}${location.code}`, province, location.location) : undefined;
    } catch (error) {
      console.error('Error fetching address:', error);
      return undefined;
    }
  };

  private cacheProvinces = (): string => this._PROVINCES_CACHE_ID_;
}
