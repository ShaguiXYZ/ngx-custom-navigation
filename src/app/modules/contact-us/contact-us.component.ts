import { Component } from '@angular/core';

// Modules
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';

// Services
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, NxHeadlineModule, NxCopytextModule, NxIconModule, QuoteFooterComponent]
})
export class ContactUsComponent {
  public footerConfig!: QuoteFooterConfig;

  constructor() {
    this.footerConfig = {
      showNext: true,
      nextLabel: 'FINALIZAR'
    };
  }

  contactUs() {
    console.log('Contact us');
  }
}
