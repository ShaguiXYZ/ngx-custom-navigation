import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { QuoteLiteralDirective } from '../../directives';
import { QuoteFooterConfig } from './models';
import { QuoteFooterService } from './services';

@Component({
  selector: 'quote-footer',
  templateUrl: './quote-footer.component.html',
  styleUrl: './quote-footer.component.scss',
  standalone: true,
  imports: [CommonModule, NxButtonModule, NxIconModule, QuoteLiteralDirective],
  providers: [QuoteFooterService]
})
export class QuoteFooterComponent implements OnInit, OnDestroy {
  @Input()
  public config: QuoteFooterConfig = {
    showNext: true,
    showBack: false
  };

  public _mobileMode?: boolean;
  public _observedMobileMode?: boolean;

  private readonly subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly footerService = inject(QuoteFooterService);

  ngOnInit(): void {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this._observedMobileMode = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    !this.config.ignoreQuoteConfig && this.footerButtonProperties();
  }

  get mobileMode(): boolean | undefined {
    return this._mobileMode ?? this._observedMobileMode;
  }

  @Input()
  set mobileMode(value: boolean | undefined) {
    this._mobileMode = value;
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public goToNextStep(): void {
    this.footerService.next(this.config);
  }

  public goToPreviousStep = (): void => this.footerService.previous();

  private footerButtonProperties = (): void => {
    const { navigation } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = navigation?.lastPage;
    const config: Omit<QuoteFooterConfig, 'nextFn' | 'backFn'> = lastPage?.configuration?.data?.['footerConfig'] ?? {};

    this.config = { ...this.config, ...config };
  };
}
