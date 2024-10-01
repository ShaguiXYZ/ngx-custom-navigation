import { Component } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, NxHeadlineModule, NxCopytextModule, NxIconModule, QuoteFooterComponent, QuoteLiteralDirective]
})
export class ContactUsComponent {
  public footerConfig!: QuoteFooterConfig;

  constructor() {
    this.footerConfig = {
      showNext: true,
      nextLabel: 'FINALIZAR'
    };
  }
}
