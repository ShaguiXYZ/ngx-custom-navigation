import { inject, Injectable } from '@angular/core';
import { DataInfo, HttpService, HttpStatus, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocationDTO, LocationModel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private readonly _PROVINCES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private readonly httpService = inject(HttpService);

  public getProvince = async (provinceCode: string): Promise<string> => {
    return firstValueFrom(
      this.httpService
        .get<DataInfo>(`${environment.baseUrl}/provinces`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ProvinceNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheProvinces(), ttl: TTL.XXL }
        })
        .pipe(
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

    return this.getProvince(provinceCode).then(async province => {
      if (!province) {
        return undefined;
      }

      const locations = await firstValueFrom(
        this.httpService
          .get<LocationDTO[]>(`${environment.baseUrl}/locations`, {
            responseStatusMessage: {
              [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(map(res => res as LocationDTO[]))
      );

      const location = locations.find(data => data.province === provinceCode && data.code === locationCode);

      return location ? LocationModel.create(`${location.province}${location.code}`, province, location.location) : undefined;
    });
  };

  private cacheProvinces = (): string => this._PROVINCES_CACHE_ID_;
}
