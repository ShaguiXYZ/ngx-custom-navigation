import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { QuoteService } from '../services';

@Component({
  template: ''
})
export abstract class QuoteComponent {
  private readonly quoteService = inject(QuoteService);

  constructor() {
    this.updateComponentData();
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;

  private updateComponentData = (): Promise<void> => Promise.resolve().then(() => this.quoteService.loadComponentData(this));
}
