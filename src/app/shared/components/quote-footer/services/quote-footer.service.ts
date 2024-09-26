import { Injectable, inject } from '@angular/core';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class QuoteFooterService {
  private readonly routingService = inject(RoutingService);

  public nextStep(config: QuoteFooterConfig = { showNext: true }): void {
    this.routingService.nextStep();
  }

  public previousStep = this.routingService.previousStep.bind(this.routingService);
}
