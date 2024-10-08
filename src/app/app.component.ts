import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from './core/constants';
import { AppContextData } from './core/models';
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

  public prepareRoute = (outlet?: RouterOutlet) => outlet?.isActivated && this.slideTo();

  private slideTo(): number {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    return contextData.navigation.viewedPages.length;
  }
}
