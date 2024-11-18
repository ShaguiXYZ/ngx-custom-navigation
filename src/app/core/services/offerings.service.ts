import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { deepCopy, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OfferingDTO, PricingDTO, QuoteModel, QuoteOfferingModel, SignedModel } from '../models';

@Injectable()
export class OfferingsService {
  private readonly httpService = inject(HttpService);

  public pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    if (!quote.signature?.hash || quote.signature?.changed) {
      console.log('Quote changed', deepCopy(quote));

      return firstValueFrom(
        this.httpService
          .post<PricingDTO, OfferingDTO>(`${environment.baseUrl}/offerings`, PricingDTO.fromModel(quote), {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(
            tap(() => {
              SignedModel.reset(quote);
            }),
            map(res => QuoteOfferingModel.fromDTO(res as OfferingDTO))
          )
      );
    } else {
      console.log('Quote not changed', deepCopy(quote));

      return Promise.resolve(quote.offering);
    }
  }
}
