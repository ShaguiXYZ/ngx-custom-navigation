import { Component } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
    selector: 'quote-on-boarding',
    templateUrl: './on-boarding.component.html',
    styleUrl: './on-boarding.component.scss',
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
export class OnBoardingComponent extends QuoteComponent<QuoteModel> {
  public icon = 'fa-car-rear';
}
