import { Component, inject } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { QuoteService } from '../services';

@Component({
  template: ''
})
export abstract class QuoteComponent {
  private readonly quoteService = inject(QuoteService);

  constructor() {
    Promise.resolve().then(() => this.quoteService.loadComponentData(this));
  }

  public canDeactivate:
    | ((currentRoute?: ActivatedRouteSnapshot, state?: RouterStateSnapshot, next?: RouterStateSnapshot) => MaybeAsync<GuardResult>)
    | undefined;
}
