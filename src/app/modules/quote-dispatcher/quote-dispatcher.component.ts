import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData, Page } from 'src/app/core/models';
import { ActivatorFn } from 'src/app/core/service-activators';
import { BudgetActivator } from 'src/app/core/service-activators/budget.activator';
import { QuoteTrackService } from 'src/app/core/tracking';

/**
 * This component is used to load the routing module dynamically.
 *
 * @see app.routes.ts
 * @see sdc-route.service.ts
 */
@Component({
  template: '',
  standalone: true
})
export class QuoteDispatcherComponent implements OnInit {
  private readonly contextDataService = inject(ContextDataService);
  private readonly trackService = inject(QuoteTrackService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    const {
      configuration: { homePageId, pageMap }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    const {
      params: { stored, dispatcher }
    } = this._route.snapshot;

    if (dispatcher) {
      this.trackService.trackView(dispatcher);
      this._router.navigate([Page.routeFrom(pageMap[dispatcher])], { skipLocationChange: true });

      return;
    }

    if (stored) {
      await (BudgetActivator.retrieveBudget({ contextDataService: this.contextDataService }) as ActivatorFn)({
        budget: stored as string
      });
    }

    if (homePageId) {
      this._router.navigate([Page.routeFrom(pageMap[homePageId])], { skipLocationChange: true });
    } else {
      throw new JourneyError('Home page not found in configuration');
    }
  }
}
