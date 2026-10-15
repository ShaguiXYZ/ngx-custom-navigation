import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from '../../core/constants';
import { JourneyError } from '../../core/errors';
import { AppContextData } from '../../core/models';
import { ActivatorFn } from '../../core/service-activators';
import { BudgetActivator } from '../../core/service-activators/budget.activator';
import { SettingsService } from '../../core/services';
import { QuoteTrackService } from '../../core/tracking';
import { AppUrls } from '../../shared/config';
import { QuoteLiteralPipe } from '../../shared/pipes';

/**
 * This component is used to load the routing module dynamically.
 *
 */
@Component({
  template: `
    <div class="quote-dispatcher">{{ { value: 'Label.Loading', params: { page: nextPageId }, type: 'translate' } | quoteLiteral }}</div>
  `,
  styleUrl: './quote-dispatcher.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [QuoteLiteralPipe]
})
export class QuoteDispatcherComponent implements OnInit {
  // @howto: dynamic binding of request parameters (see: withComponentInputBinding() in app config).
  // public stored = input.required<string>();
  // public dispatcher = input.required<string>();

  public nextPageId!: string;

  private readonly contextDataService = inject(ContextDataService);
  private readonly settingsService = inject(SettingsService);
  private readonly trackService = inject(QuoteTrackService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    // @howto: Retrieve request parameters from ActivatedRoute
    const {
      params: { stored, dispatcher }
    } = this._route.snapshot;

    if (stored) {
      await (BudgetActivator.retrieveBudget({ contextDataService: this.contextDataService }) as ActivatorFn)({
        budget: stored
      });
    }

    if (dispatcher) {
      this.trackService.trackView(dispatcher);
    }

    this.loader();
  }

  private loader = async (): Promise<void> => {
    const {
      configuration: { homePageId },
      navigation: { nextPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (homePageId) {
      nextPage?.pageId ?? this.resetContext();
      this.nextPageId = nextPage?.pageId ?? homePageId;

      await this.settingsService.loadSettings();

      this._router.navigate([AppUrls._loader], { skipLocationChange: true });
    } else {
      throw new JourneyError('Home page not found in configuration');
    }
  };

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
