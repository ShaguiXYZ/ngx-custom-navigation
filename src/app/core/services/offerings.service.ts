import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { deepCopy, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfferingDTO, QuoteModel, QuoteOfferingModel } from '../models';

@Injectable({ providedIn: 'root' })
export class OfferingsService {
  private readonly httpService = inject(HttpService);

  public pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    if (quote.changed) {
      console.log('Quote changed', deepCopy(quote));

      return firstValueFrom(
        this.httpService
          .get<OfferingDTO>(`${environment.baseUrl}/offerings`, {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(map(res => QuoteOfferingModel.fromDTO(res as OfferingDTO)))
      );
    } else {
      console.log('Quote not changed', deepCopy(quote));

      return Promise.resolve(quote.offering);
    }
  }
}
