import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { IconDictionary } from 'src/app/core/models';

@Injectable()
export class InsuranceComponentService {
  private readonly _ICON_INSURANCES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private http = inject(HttpService);

  public iconInsurances(): Promise<IconDictionary> {
    return firstValueFrom(
      this.http
        .get<IconDictionary>('assets/json/mock/icon-insurances', {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.IconInsurancesNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheIconInsurances(), ttl: TTL.XXL }
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

  private cacheIconInsurances = (): string => this._ICON_INSURANCES_CACHE_ID_;
}
