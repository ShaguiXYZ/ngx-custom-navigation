import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { deepCopy, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { OfferingDTO, QuoteOfferingModel } from 'src/app/core/models';
import { ServiceActivatorService } from '../../core/service-activators';
import { PricingDTO, QuoteModel } from '../models';

const OFFERING_API = '/offering';

@Injectable()
export class OfferingsService {
  private readonly serviceActivatorService = inject(ServiceActivatorService);
  private readonly httpService = inject(HttpService);

  public async pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    const { signature } = quote;

    console.log('Pricing quote', deepCopy(quote));

    if (signature?.hash !== quote.offering.hash) {
      const offeringConfigData = await firstValueFrom(
        this.httpService.get(`assets/json/offering.config.json`).pipe(map(res => res as Partial<PricingDTO>))
      );

      return firstValueFrom(
        this.httpService
          .post<PricingDTO, OfferingDTO>(`${OFFERING_API}/get`, PricingDTO.fromModel(quote, offeringConfigData), {
            responseStatusMessage: {
              [HttpStatusCode.NotFound]: { text: 'Notifications.ModelsNotFound' }
            },
            showLoading: true
          })
          .pipe(
            map(res => res as OfferingDTO),
            map(OfferingDTO.toModel),
            tap(async offering => {
              quote.offering = { ...quote.offering, quotationId: offering.quotationId, prices: offering.prices, priceIndex: 0 };
              quote.signature = { ...quote.signature, hash: QuoteModel.hash(quote) };
              quote.offering.hash = quote.signature.hash;

              await this.serviceActivatorService.activateEntryPoint('$on-pricing');

              console.log('Quote changed');
            })
          )
      );
    } else {
      console.log('Quote not changed');

      return quote.offering;
    }
  }
}
