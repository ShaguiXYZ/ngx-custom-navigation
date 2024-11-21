import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { OfferingPriceModel, QuoteModel } from 'src/app/core/models';
import { QuoteLiteralDirective } from '../../directives';
import { HeaderTitleComponent } from '../header-title';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './quote-offering-coverages.component.html',
  styleUrls: ['./quote-offering-coverages.component.scss'],
  imports: [
    CommonModule,
    HeaderTitleComponent,
    NxAccordionModule,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxHeadlineModule,
    NxInputModule,
    NxTabsModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ],
  standalone: true
})
export class QuoteOfferingCoveragesComponent implements OnInit {
  @Input()
  public selectedPriceIndex = 0;

  public data: { selectedPriceIndex: number } = { selectedPriceIndex: 0 };

  public prices: OfferingPriceModel[] = [];

  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    const {
      offering: { prices }
    } = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.prices = prices ?? [];

    console.log('this.prices', this.data);
  }
}
