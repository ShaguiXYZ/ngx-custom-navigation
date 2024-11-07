import { Component, ViewEncapsulation } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { QuoteComponent } from 'src/app/core/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, NxCopytextModule, NxHeadlineModule, QuoteFooterComponent, QuoteLiteralDirective, QuoteLiteralPipe],
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent extends QuoteComponent {
  public contactUsTexts: string[] = ['<h1 class="info-header">Horario comercial</h1>', 'Lunes a Jueves de 9h a 19h', 'Viernes de 9h a 18h'];
}
