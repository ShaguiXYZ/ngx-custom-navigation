import { CommonModule } from '@angular/common';
import { Component, Inject, inject, OnInit } from '@angular/core';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NX_MODAL_DATA } from '@aposin/ng-aquila/modal';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { Coverage, OfferingPriceModel, QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, TranslateTextComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './offering-coverages.component.html',
  styleUrls: ['./offering-coverages.component.scss'],
  imports: [
    CommonModule,
    HeaderTitleComponent,
    TranslateTextComponent,
    NxAccordionModule,
    NxCopytextModule,
    NxHeadlineModule,
    NxTabsModule,
    QuoteLiteralDirective
  ]
})
export class QuoteOfferingCoveragesComponent implements OnInit {
  public selectedPriceIndex!: number;
  public prices: OfferingPriceModel[] = [];
  public coverageSelectecd?: number;

  private readonly contextDataService = inject(ContextDataService);

  constructor(
    @Inject(NX_MODAL_DATA)
    public data: {
      selectedPriceIndex: number;
    }
  ) {}

  ngOnInit(): void {
    const {
      offering: { prices }
    } = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.prices = prices ?? [];

    this.selectedPriceIndex = this.data.selectedPriceIndex ?? 0;
  }

  public onCoverageOpened(coverage: Coverage): void {
    this.coverageSelectecd = coverage.code;
  }
}
