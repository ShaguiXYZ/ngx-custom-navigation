import { Component, HostListener, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
import { RoutingService } from './core/services';
import { routeTransitions } from './shared/animations';
import { QuoteFooterComponent, QuoteHeaderComponent, QuoteLoadingComponent, QuoteStepperComponent } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitions('slide')],
  standalone: true,
  imports: [
    RouterModule,
    NxGridModule,
    NxLinkModule,
    QuoteFooterComponent,
    QuoteHeaderComponent,
    QuoteLoadingComponent,
    QuoteStepperComponent
  ]
})
export class AppComponent {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  // @howto Detect the Closing of a Browser Tab
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
  }

  // @hotto
  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    this.routingService.previousStep();

    event.stopPropagation();
  }

  public prepareRoute = (outlet?: RouterOutlet) => outlet?.isActivated && this.slideTo();

  private slideTo(): number {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return contextData.navigation.viewedPages.length;
  }
}
