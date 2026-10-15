import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { QuoteComponent } from '../../../../core/components';
import { HeaderTitleComponent, QuoteFooterComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [QuoteFooterComponent, HeaderTitleComponent, NxButtonModule, NxCopytextModule, NxHeadlineModule, QuoteLiteralDirective]
})
export class ConfirmationComponent extends QuoteComponent<QuoteModel> {
  public icon = 'fa-face-smile';
  public href = environment.mockUrl;

  public readonly router = inject(Router);

  finishFlow() {
    window.location.assign(environment.mockUrl);
  }
}
