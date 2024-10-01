import { Component } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteFooterConfig } from 'src/app/shared/components/quote-footer/models';

@Component({
  selector: 'app-apology-screen',
  templateUrl: './apology-screen.component.html',
  styleUrl: './apology-screen.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, QuoteFooterComponent, NxButtonModule, NxCardModule, NxCopytextModule, NxHeadlineModule, NxIconModule]
})
export class ApologyComponent {
  public footerConfig!: QuoteFooterConfig;

  constructor() {
    this.footerConfig = {
      showNext: true,
      nextLabel: 'FINALIZAR'
    };
  }
}
