import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { environment } from 'src/environments/environment';
import { QuoteComponent } from '../../_quote-component';

@Component({
  selector: 'quote-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  standalone: true,
  imports: [QuoteFooterComponent, HeaderTitleComponent, NxButtonModule, NxCopytextModule, NxHeadlineModule, QuoteLiteralDirective]
})
export class ConfirmationComponent extends QuoteComponent {
  public icon = 'fa-face-smile';
  public href = environment.baseUrl;

  public readonly router = inject(Router);

  finishFlow() {
    window.location.assign(environment.baseUrl);
  }
}
