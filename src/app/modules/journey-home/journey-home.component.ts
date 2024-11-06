import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData, Page } from 'src/app/core/models';

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

  constructor(private readonly _router: Router) {}

  ngOnInit(): void {
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const { homePageId, pageMap } = context.configuration;

    if (homePageId) {
      this._router.navigate([Page.routeFrom(pageMap[homePageId])], { skipLocationChange: true });
    } else {
      throw new JourneyError('Home page not found in configuration');
    }
  }
}
