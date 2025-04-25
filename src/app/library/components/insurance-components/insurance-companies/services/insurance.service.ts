import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, TTL } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { IconDictionary } from 'src/app/core/models';
import { _ICON_INSURANCES_CACHE_ID_ } from 'src/app/library/models/constants';

@Injectable()
export class InsuranceComponentService {
  private http = inject(HttpService);

  public iconInsurances(): Promise<IconDictionary> {
    return firstValueFrom(
      this.http
        .get<IconDictionary>('assets/json/mock/icon-insurances', {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.IconInsurancesNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheIconInsurances(), ttl: TTL.XL }
        })
        .pipe(
          map(res => res as IconDictionary),
          map(res => {
            return Object.keys(res)
              .filter(key => res[key].active)
              .reduce((acc, key) => {
                acc[key] = res[key];
                return acc;
              }, {} as IconDictionary);
          })
        )
    );
  }

  private cacheIconInsurances = (): string => _ICON_INSURANCES_CACHE_ID_;
}
