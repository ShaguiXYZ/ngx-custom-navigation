import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, IndexedData, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { InsuranceCompany, InsuranceCompanyDTO } from '../models';
import { environment } from 'src/environments/environment';

const INSURANCE_API = '/_insurance';

@Injectable()
export class InsuranceCompaniesService {
  private readonly _COMPANIES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private readonly httpService = inject(HttpService);

  public companies(insurance?: string): Promise<IndexedData[]> {
    return firstValueFrom(
      this.httpService
        .get<InsuranceCompanyDTO[]>(`${environment.baseUrl}${INSURANCE_API}/companies`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheInsuranceCompanies(), ttl: TTL.XXL }
        })
        .pipe(
          map(res => res as InsuranceCompanyDTO[]),
          map(res => res.map(data => InsuranceCompany.create(data))),
          map(res => (insurance ? res.filter(data => data.data.toLowerCase().includes(insurance.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.data.localeCompare(b.data)))
        )
    );
  }
  private cacheInsuranceCompanies = (): string => `${this._COMPANIES_CACHE_ID_}_`;
}
