import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { OfferingPriceModel } from 'src/app/shared/models';
import { QuoteLiteralDirective } from '../../directives';
import { HeaderTitleComponent } from '../header-title';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './quote-offering-coverages.component.html',
  styleUrl: './quote-offering-coverages.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, NxAccordionModule, NxHeadlineModule, NxTabsModule, QuoteLiteralDirective]
})
export class QuoteOfferingCoveragesComponent {
  @Input()
  public selectedPriceIndex = 0;

  @Input()
  public prices: OfferingPriceModel[] = [];
}
