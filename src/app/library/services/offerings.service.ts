import { HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { deepCopy, HttpService } from '@shagui/ng-shagui/core';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ServiceActivatorService } from '../../core/service-activators';
import { OfferingDTO, PricingDTO, QuoteModel, QuoteOfferingModel } from '../models';

@Injectable()
export class OfferingsService {
  private readonly serviceActivatorService = inject(ServiceActivatorService);
  private readonly httpService = inject(HttpService);

  public async pricing(quote: QuoteModel): Promise<QuoteOfferingModel> {
    const { signature } = quote;

    console.log('Pricing quote', deepCopy(quote));

    if (signature?.hash !== quote.offering.hash) {
      const offeringStaticData = await firstValueFrom(
        this.httpService.get(`assets/json/offering.config.json`).pipe(map(res => res as Partial<PricingDTO>))
      );

      return firstValueFrom(
        this.httpService
          .post<PricingDTO, OfferingDTO>(`${environment.baseUrl}/offerings`, PricingDTO.fromModel(quote, offeringStaticData), {
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
