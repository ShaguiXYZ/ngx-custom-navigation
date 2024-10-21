import { Injectable, inject } from '@angular/core';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

@Injectable()
export class QuoteFooterService {
  private readonly routingService = inject(RoutingService);

  public nextStep = (config: QuoteFooterConfig = { showNext: true }): void => {
    const preventDefault = config.nextFn?.();
    console.log(preventDefault);

    !preventDefault && this.routingService.nextStep();
  };

  public previousStep = (config: QuoteFooterConfig = { showNext: true }): void => {
    config.backFn?.();
    this.routingService.previousStep();
  };
}
