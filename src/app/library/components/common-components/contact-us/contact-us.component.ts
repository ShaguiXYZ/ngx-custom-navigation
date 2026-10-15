import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { QuoteComponent } from '../../../../core/components';
import { HeaderTitleComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  imports: [HeaderTitleComponent, QuoteFooterComponent, QuoteLiteralDirective, QuoteLiteralPipe, NxCopytextModule, NxHeadlineModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent extends QuoteComponent<QuoteModel> {
  public bodyLines: string[] = [];
}
