import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from '../constants';
import { QuoteService } from '../services';
import { QuoteModel } from './quote.model';

@Component({
  template: ''
})
export abstract class QuoteComponent {
  protected contextData: QuoteModel;

  private readonly quoteService = inject(QuoteService);
  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);

    this.updateComponentData();
  }

  protected populateContextData = (): void => {
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  };

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private updateComponentData = (): Promise<void> => Promise.resolve().then(() => this.quoteService.loadComponentData(this));
}
