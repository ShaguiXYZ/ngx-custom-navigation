import { Component, ViewEncapsulation } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { QuoteComponent } from '../../_quote-component';

@Component({
  selector: 'quote-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, QuoteFooterComponent, QuoteLiteralDirective, QuoteLiteralPipe, NxCopytextModule, NxHeadlineModule],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent extends QuoteComponent {
  public contactUsTexts: string[] = [];
}
