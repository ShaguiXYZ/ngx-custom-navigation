import { Injectable, inject } from '@angular/core';
import { emptyFn } from '@shagui/ng-shagui/core';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class QuoteFooterService {
  private readonly routingService = inject(RoutingService);

  public onError: () => void = emptyFn;

  public nextStep(config: QuoteFooterConfig = { showNext: true }): void {
    const isValidData = (): boolean => !config?.validationFn || config.validationFn();

    this.routingService.nextStep(isValidData, this.onError);
  }

  public previousStep = this.routingService.previousStep.bind(this.routingService);
}
