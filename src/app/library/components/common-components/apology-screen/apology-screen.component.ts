import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { QuoteComponent } from '../../../../core/components';
import { HeaderTitleComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-apology-screen',
  templateUrl: './apology-screen.component.html',
  styleUrl: './apology-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    NxButtonModule,
    NxCardModule,
    NxCopytextModule,
    NxHeadlineModule,
    QuoteLiteralDirective
  ]
})
export class ApologyComponent extends QuoteComponent<QuoteModel> {
  public icon = 'fa-face-frown';
}
