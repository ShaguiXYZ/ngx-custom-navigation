import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, QuoteFooterComponent, NxButtonModule, NxCardModule, NxCopytextModule, NxHeadlineModule, NxIconModule]
})
export class OnboardingComponent {
  private readonly routingService = inject(RoutingService);

  public footerConfig!: QuoteFooterConfig;

  constructor() {
    this.footerConfig = {
      showNext: true,
      nextLabel: 'EMPEZAR'
    };
  }

  goToNextStep() {
    this.routingService.nextStep();
  }
}
