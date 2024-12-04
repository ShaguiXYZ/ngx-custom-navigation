import { Component } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteZoneComponent,
    NxButtonModule,
    NxCardModule,
    NxCopytextModule,
    NxHeadlineModule,
    QuoteLiteralDirective
  ]
})
export class OnboardingComponent extends QuoteComponent {}
