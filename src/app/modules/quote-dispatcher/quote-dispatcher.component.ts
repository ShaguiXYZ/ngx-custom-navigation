import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData } from 'src/app/core/models';
import { ActivatorFn } from 'src/app/core/service-activators';
import { BudgetActivator } from 'src/app/core/service-activators/budget.activator';
import { SettingsService } from 'src/app/core/services';
import { QuoteTrackService } from 'src/app/core/tracking';
import { AppUrls } from 'src/app/shared/config';

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
  private readonly settingsService = inject(SettingsService);
  private readonly trackService = inject(QuoteTrackService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    const {
      configuration: { homePageId, pageMap },
      navigation: { nextPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    const {
      params: { stored, dispatcher }
    } = this._route.snapshot;

    if (dispatcher) {
      const nextPage = pageMap[dispatcher];

      this.trackService.trackView(dispatcher);
      this._router.navigate([nextPage.pageId], { skipLocationChange: true });

      return;
    }

    if (stored) {
      await (BudgetActivator.retrieveBudget({ contextDataService: this.contextDataService }) as ActivatorFn)({
        budget: stored as string
      });
    }

    if (homePageId) {
      if (!nextPage?.pageId) this.resetContext();

      await this.settingsService.loadSettings();

      this._router.navigate([AppUrls._loader], { skipLocationChange: true });
    } else {
      throw new JourneyError('Home page not found in configuration');
    }
  }

  private resetContext = (): void => {
    const context = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const viewedPages = context.navigation.viewedPages.filter(pageId => context.configuration.pageMap[pageId]);
    const nextPage = context.configuration.pageMap[viewedPages[viewedPages.length - 1]];

    context.navigation.viewedPages = viewedPages;
    context.navigation.lastPage = undefined;
    context.navigation.nextPage = nextPage;
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, context);
  };
}
