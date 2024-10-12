import { Component, HostListener, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService, NotificationService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
import { RoutingService } from './core/services';
import { routeTransitions } from './shared/animations';
import {
  NotificationComponent,
  QuoteFooterComponent,
  QuoteHeaderComponent,
  QuoteLoadingComponent,
  QuoteStepperComponent
} from './shared/components';
import { QuoteLiteralPipe } from './shared/pipes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitions('slide')],
  standalone: true,
  providers: [QuoteLiteralPipe],
  imports: [
    RouterModule,
    NxGridModule,
    NxLinkModule,
    NotificationComponent,
    QuoteFooterComponent,
    QuoteHeaderComponent,
    QuoteLoadingComponent,
    QuoteStepperComponent
  ]
})
export class AppComponent {
  private readonly contextDataService = inject(ContextDataService);
  private readonly notificationService = inject(NotificationService);
  private readonly routingService = inject(RoutingService);

  constructor(private readonly quoteLiteralPipe: QuoteLiteralPipe) {}

  // @howto Detect the Closing of a Browser Tab
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  // @howto Detect the Browser Back Button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    this.notificationService.warning(
      this.quoteLiteralPipe.transform('warning-header-back-button'),
      this.quoteLiteralPipe.transform('warning-text-back-button')
    );
    this.routingService.previousStep();

    event.stopPropagation();
  }

  public prepareRoute = (outlet?: RouterOutlet) => outlet?.isActivated && this.slideTo();

  private slideTo(): number {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return contextData.navigation.viewedPages.length;
  }
}
