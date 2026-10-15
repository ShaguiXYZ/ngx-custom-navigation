import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QuoteComponent } from '../../../../core/components';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrl: './on-boarding.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
