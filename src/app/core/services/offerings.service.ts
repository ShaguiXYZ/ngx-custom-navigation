import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContextDataService, deepCopy, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppContextData, OfferingDTO, PricingDTO, QuoteModel, QuoteOfferingModel, SignedModel } from '../models';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { ServiceActivatorService } from '../service-activators';

@Injectable()
export class OfferingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly serviceActivatorService = inject(ServiceActivatorService);
  private readonly httpService = inject(HttpService);

  public pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    if (!quote.signature?.hash || quote.signature?.changed) {
      const { settings } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
      console.log('Quote changed', deepCopy(quote));

      return firstValueFrom(
        this.httpService
          .post<PricingDTO, OfferingDTO>(`${environment.baseUrl}/offerings`, PricingDTO.fromModel(quote, settings), {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(
            tap(async () => {
              await this.serviceActivatorService.activateService('on-pricing');
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
