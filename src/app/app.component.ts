import { Component, HostListener, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
import { RoutingService } from './core/services';
import { routeTransitions } from './shared/animations';
import {
  NotificationComponent,
  QuoteHeaderComponent,
  QuoteKeysComponent,
  QuoteLoadingComponent,
  QuoteStepperComponent
} from './shared/components';
import { QuoteLiteralPipe } from './shared/pipes';
import { QuoteTrackService } from './core/tracking';

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
    NotificationComponent,
    QuoteKeysComponent,
    QuoteHeaderComponent,
    QuoteLoadingComponent,
    QuoteStepperComponent
  ]
})
export class AppComponent {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);
  private readonly trackSercice = inject(QuoteTrackService);

  // @howto Detect the Closing of a Browser Tab
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: BeforeUnloadEvent): void {
    event.preventDefault();
  }

  // @howto Detect the Browser Back Button
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent): void {
    this.routingService.previous();

    event.preventDefault();
    event.stopPropagation();
  }

  public prepareRoute = (outlet?: RouterOutlet): number => (outlet?.isActivated ? this.slideTo() : -1);

  private slideTo(): number {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return contextData.navigation.viewedPages.length;
  }
}
