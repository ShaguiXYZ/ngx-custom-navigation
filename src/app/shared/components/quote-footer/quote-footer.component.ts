import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteFooterConfig } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective, TrackInfo } from 'src/app/core/tracking';
import { QuoteLiteralDirective } from '../../directives';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteZoneComponent } from '../quote-zone';
import { QuoteFooterInfoComponent } from './components';

@Component({
    selector: 'quote-footer',
    templateUrl: './quote-footer.component.html',
    styleUrl: './quote-footer.component.scss',
    imports: [QuoteFooterInfoComponent, QuoteZoneComponent, CommonModule, NxButtonModule, QuoteLiteralDirective, QuoteTrackDirective]
})
export class QuoteFooterComponent implements OnInit, OnDestroy {
  @Input()
  public config: QuoteFooterConfig = {
    showNext: true,
    showBack: false
  };

  @Output()
  public uiOnNext: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public uiOnPrevious: EventEmitter<void> = new EventEmitter<void>();

  public _mobileMode?: boolean;
  public _observedMobileMode?: boolean;

  private _trackInfo: TrackInfo = {};
  private _trackinfo: TrackInfo = {};

  private readonly subscription$: Subscription[] = [];

  private readonly quoteLiteralPipe = inject(QuoteLiteralPipe);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.subscription$.push(
      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.WebPortrait])
        .subscribe((state: BreakpointState) => (this._observedMobileMode = state.breakpoints[Breakpoints.HandsetPortrait]))
    );

    this._trackinfo = { label: this.quoteLiteralPipe.transform('footer-next') };

    !this.config.ignoreQuoteConfig && this.footerButtonProperties();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  public get trackInfo(): TrackInfo {
    return { ...this._trackinfo, ...this._trackInfo };
  }

  @Input()
  public set trackInfo(value: TrackInfo) {
    this._trackInfo = value;
  }

  get mobileMode(): boolean | undefined {
    return this._mobileMode ?? this._observedMobileMode;
  }

  @Input()
  set mobileMode(value: boolean | undefined) {
    this._mobileMode = value;
  }

  public goToNextStep(): void {
    this.uiOnNext.emit();
    this.next(this.config);
  }

  public goToPreviousStep = (): void => {
    this.uiOnPrevious.emit();
    this.previous();
  };

  private footerButtonProperties = (): void => {
    const { navigation } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = navigation?.lastPage;
    const config = (lastPage?.configuration?.data?.['footerConfig'] as Partial<QuoteFooterConfig>) ?? {};

    this.config = { ...this.config, ...config };
  };

  private next = async (config: QuoteFooterConfig = { showNext: true }): Promise<boolean> => {
    if (config.nextFn?.()) {
      return false;
    }

    return this.routingService.next();
  };

  private previous = (config: QuoteFooterConfig = { showNext: true }): void => {
    config.backFn?.();
    this.routingService.previous();
  };
}
