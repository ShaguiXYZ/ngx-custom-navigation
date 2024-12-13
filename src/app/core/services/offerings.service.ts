import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { QUOTE_APP_CONTEXT_DATA } from '../constants';
import { AppContextData, OfferingDTO, PricingDTO, QuoteModel, QuoteOfferingModel, SignatureModel } from '../models';
import { ServiceActivatorService } from '../service-activators';

@Injectable()
export class OfferingsService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly serviceActivatorService = inject(ServiceActivatorService);
  private readonly httpService = inject(HttpService);

  public pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    const { signature } = quote;

    if (signature?.hash !== quote.offering.hash) {
      const { settings } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

      return firstValueFrom(
        this.httpService
          .post<PricingDTO, OfferingDTO>(`${environment.baseUrl}/offerings`, PricingDTO.fromModel(quote, settings), {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(
            map(res => res as OfferingDTO),
            map(OfferingDTO.toModel),
            tap(async offering => {
              quote.offering = { ...quote.offering, quotationId: offering.quotationId, prices: offering.prices };
              quote.signature = { ...quote.signature, ...QuoteModel.signModel(quote) };
              quote.offering.hash = quote.signature.hash;

              await this.serviceActivatorService.activateEntryPoint('on-pricing');

              console.log('Quote changed');
            })
          )
      );
    } else {
      console.log('Quote not changed');

      return Promise.resolve(quote.offering);
    }
  }
}
