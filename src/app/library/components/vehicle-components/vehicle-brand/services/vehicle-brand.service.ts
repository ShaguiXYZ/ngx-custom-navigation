import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, TTL } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { IconDictionary } from 'src/app/core/models';
import { _ICON_BRANCHES_CACHE_ID_ } from 'src/app/library/models/constants';

@Injectable()
export class BrandComponentService {
  private http = inject(HttpService);

  public iconBrands(): Promise<IconDictionary> {
    return firstValueFrom(
      this.http
        .get<IconDictionary>('assets/json/mock/icon-brands', {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.IconBrandsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheIconBrands(), ttl: TTL.L }
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

  private cacheIconBrands = (): string => _ICON_BRANCHES_CACHE_ID_;
}
