import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'quote-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.scss',
    imports: [QuoteFooterComponent, HeaderTitleComponent, NxButtonModule, NxCopytextModule, NxHeadlineModule, QuoteLiteralDirective]
})
export class ConfirmationComponent extends QuoteComponent<QuoteModel> {
  public icon = 'fa-face-smile';
  public href = environment.baseUrl;

  public readonly router = inject(Router);

  finishFlow() {
    window.location.assign(environment.baseUrl);
  }
}
