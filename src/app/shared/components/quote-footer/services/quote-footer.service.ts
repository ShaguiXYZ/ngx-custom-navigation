import { Injectable, inject } from '@angular/core';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

@Injectable()
export class QuoteFooterService {
  private readonly routingService = inject(RoutingService);

  public nextStep = async (config: QuoteFooterConfig = { showNext: true }): Promise<boolean> => {
    if (config.nextFn?.()) {
      return false;
    }
    return this.routingService.nextStep();
  };

  public previousStep = (config: QuoteFooterConfig = { showNext: true }): void => {
    config.backFn?.();
    this.routingService.previousStep();
  };
}
