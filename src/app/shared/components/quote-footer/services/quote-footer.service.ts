import { Injectable, inject } from '@angular/core';
import { ContextDataService, emptyFn } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteFooterConfig } from '../models';

@Injectable({ providedIn: 'root' })
export class QuoteFooterService {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  public onError: () => void = emptyFn;

  public nextStep(config: QuoteFooterConfig = { showNext: true }): void {
    const isValidData = (): boolean => !config?.validationFn || config.validationFn();

    this.routingService.nextStep(isValidData, this.onError);
  }

  public previousStep(): void {
    const pagesSeen = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA_NAME).viewedPages;
    this.routingService.previousStep(pagesSeen[pagesSeen.length - 2]);
  }
}
