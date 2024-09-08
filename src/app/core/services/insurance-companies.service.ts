import { inject, Injectable } from '@angular/core';
import { HttpService, HttpStatus, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { IIconData } from 'src/app/shared/models';
import { IndexedData } from '../models';

@Injectable({ providedIn: 'root' })
export class InsuranceCompaniesService {
  private readonly _COMPANIES_CACHE_ID_ = `_${UniqueIds.next()}_`;
  private readonly vehicleUri = './assets/json/mock';
  private readonly uriImages = 'assets/images/wm/insurances/company';

  private http = inject(HttpService);

  public companies(): Promise<IIconData[]> {
    return firstValueFrom(
      this.http
        .get<IndexedData[]>(`${this.vehicleUri}/insurance-companies.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheInsuranceCompanies(), ttl: TTL.XXL }
        })
        .pipe(
          map(res => res as IndexedData[]),
          map(data => data.map<IIconData>(value => ({ ...value, icon: `${this.uriImages}/${value.data}.png` })))
        )
    );
  }

  private cacheInsuranceCompanies = (): string => `${this._COMPANIES_CACHE_ID_}_`;
}
