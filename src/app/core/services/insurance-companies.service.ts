import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpService, IndexedData, TTL, UniqueIds } from '@shagui/ng-shagui/core';
import { catchError, firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpError } from '../errors';
import { InsuranceCompany, InsuranceCompanyDTO } from '../models';

@Injectable()
export class InsuranceCompaniesService {
  private readonly _COMPANIES_CACHE_ID_ = `_${UniqueIds.next()}_`;

  private readonly httpService = inject(HttpService);

  public companies(insurance?: string): Promise<IndexedData[]> {
    return firstValueFrom(
      this.httpService
        .get<InsuranceCompanyDTO[]>(`${environment.baseUrl}/insurance-companies`, {
          responseStatusMessage: {
            [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true,
          cache: { id: this.cacheInsuranceCompanies(), ttl: TTL.XXL }
        })
        .pipe(
          catchError(error => {
            throw new HttpError(error.status, error.statusText);
          }),
          map(res => res as InsuranceCompanyDTO[]),
          map(res => res.map(data => InsuranceCompany.create(data))),
          map(res => (insurance ? res.filter(data => data.data.toLowerCase().includes(insurance.toLowerCase())) : res)),
          map(res => res.sort((a, b) => a.data.localeCompare(b.data)))
        )
    );
  }

  private cacheInsuranceCompanies = (): string => `${this._COMPANIES_CACHE_ID_}_`;
}
