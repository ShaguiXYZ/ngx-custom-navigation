import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { IconDictionary } from 'src/app/core/models';

@Injectable()
export class BrandService {
  private readonly _ICON_BRANCHES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private http = inject(HttpService);

  public iconBrands(): Promise<IconDictionary> {
    return firstValueFrom(
      this.http
        .get<IconDictionary>('assets/json/mock/icon-brands', {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.IconBrandsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheIconBrands(), ttl: TTL.XXL }
        })
        .pipe(map(res => res as IconDictionary))
    );
  }

  private cacheIconBrands = (): string => this._ICON_BRANCHES_CACHE_ID_;
}
