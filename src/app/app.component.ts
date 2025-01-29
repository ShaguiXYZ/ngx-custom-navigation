import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { $, ContextDataService, NotificationService } from '@shagui/ng-shagui/core';
import { filter, Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
import { LiteralsService } from './core/services';
import {
  CaptchaComponent,
  NotificationComponent,
  QuoteHeaderComponent,
  QuoteKeysComponent,
  QuoteLoadingComponent,
  QuoteStepperComponent
} from './shared/components';
import { QuoteLiteralDirective } from './shared/directives';
import { QuoteLiteralPipe } from './shared/pipes';

@Component({
  selector: 'quote-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [QuoteLiteralPipe],
  imports: [
    RouterModule,
    NxGridModule,
    CaptchaComponent,
    NotificationComponent,
    QuoteKeysComponent,
    QuoteHeaderComponent,
    QuoteLoadingComponent,
    QuoteStepperComponent,
    QuoteLiteralDirective
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  public verified?: boolean;

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly literalService = inject(LiteralsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  constructor() {
    const {
      settings: {
        commercialExceptions: { captchaVerified }
      }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.verified = captchaVerified;
  }

  ngOnInit(): void {
    this.subscription$.push(this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(this.resetHeaderAnimation));
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  // @howto Detect the Closing of a Browser Tab
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  // @howto Detect the Browser Back Button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.notificationService.warning(
      this.literalService.toString({ value: 'not-allowed', type: 'literal' }) || 'Operation not allowed ',
      this.literalService.toString({ value: 'use-back-button', type: 'literal' }) || 'Please use the back button in the application'
    );
  }

  public onCaptchaVerified(verified: boolean): void {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    appContextData.settings.commercialExceptions = { ...appContextData.settings.commercialExceptions, captchaVerified: verified };
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, appContextData);

    this.verified = verified;
  }

  private resetHeaderAnimation(): void {
    const headerElement = $('.app__header');

    if (headerElement) {
      headerElement.classList.remove('app__header');
      void headerElement.offsetWidth; // Trigger reflow
      headerElement.classList.add('app__header');
    }
  }
}
