import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService, NotificationService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
import { LiteralsService } from './core/services';
import { CaptchaComponent } from './modules/captcha/captcha.component';
import { routeTransitions } from './shared/animations';
import {
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
  animations: [routeTransitions('slide')],
  standalone: true,
  providers: [QuoteLiteralPipe],
  imports: [
    RouterModule,
    NxGridModule,
    NxLinkModule,
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

  private readonly contextDataService = inject(ContextDataService);
  private readonly literalService = inject(LiteralsService);
  private readonly notificationService = inject(NotificationService);

  private readonly subscription$: Subscription[] = [];

  constructor() {
    const {
      settings: {
        commercialExceptions: { captchaVerified }
      }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.verified = captchaVerified;
  }

  ngOnInit(): void {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(appContextData => {
        this.verified = appContextData.settings.commercialExceptions?.captchaVerified;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(subscription => subscription.unsubscribe());
  }

  // @howto Detect the Closing of a Browser Tab
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  // @howto Detect the Browser Back Button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    this.notificationService.warning(
      this.literalService.toString({ value: 'not-allowed', type: 'literal' }) || 'Operation not allowed ',
      this.literalService.toString({ value: 'use-back-button', type: 'literal' }) || 'Please use the back button in the application'
    );

    event.preventDefault();
    event.stopPropagation();
  }

  public prepareRoute = (outlet?: RouterOutlet): number => (outlet?.isActivated ? this.slideTo() : -1);

  private slideTo(): number {
    const {
      navigation: { viewedPages }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return viewedPages.length;
  }
}
