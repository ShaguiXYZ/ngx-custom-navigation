import { inject, Injectable } from '@angular/core';
import { HttpService, HttpStatus } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { OfferingPriceModel } from 'src/app/shared/models';

@Injectable({ providedIn: 'root' })
export class OfferingsService {
  private readonly offeringsUri = './assets/json/mock';

  private readonly httpService = inject(HttpService);

  public offerings(): Promise<OfferingPriceModel[]> {
    return firstValueFrom(
      this.httpService
        .get<OfferingPriceModel[]>(`${this.offeringsUri}/offerings.mock.json`, {
          responseStatusMessage: {
            [HttpStatus.notFound]: { text: 'Notifications.ModelsNotFound' }
          },
          showLoading: true
        })
        .pipe(map(res => res as OfferingPriceModel[]))
    );
  }
}
