import { Component } from '@angular/core';
import { NxButtonModule } from '@allianz/ng-aquila/button';
import { NxCardModule } from '@allianz/ng-aquila/card';
import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { NxHeadlineModule } from '@allianz/ng-aquila/headline';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-apology-screen',
  templateUrl: './apology-screen.component.html',
  styleUrl: './apology-screen.component.scss',
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
