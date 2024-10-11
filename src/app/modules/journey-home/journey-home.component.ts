import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';

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
export class JourneyHomeComponent implements OnInit {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly _router: Router) {}

  ngOnInit(): void {
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const { homePageId, pageMap } = context.configuration;

    if (homePageId) {
      // this.initAppDataValues();

      this._router.navigate([Page.routeFrom(pageMap[homePageId])], { skipLocationChange: true });
    } else {
      throw new Error('Home page not found in configuration');
    }
  }

  private initAppDataValues(): void {
    this.contextDataService.set(QUOTE_CONTEXT_DATA, QuoteModel.init());
  }
}
