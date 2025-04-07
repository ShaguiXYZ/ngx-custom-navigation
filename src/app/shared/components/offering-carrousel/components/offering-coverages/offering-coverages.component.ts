import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NxAccordionDirective, NxExpansionPanelComponent, NxExpansionPanelHeaderComponent } from '@aposin/ng-aquila/accordion';
import { NxCopytextComponent } from '@aposin/ng-aquila/copytext';
import { NxHeadlineComponent } from '@aposin/ng-aquila/headline';
import { NX_MODAL_DATA } from '@aposin/ng-aquila/modal';
import { NxTabComponent, NxTabGroupComponent } from '@aposin/ng-aquila/tabs';
import { Coverage, OfferingPriceModel } from 'src/app/core/models';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { HeaderTitleComponent } from '../../../header-title';
import { TranslateTextComponent } from '../../../translate-text/translate-text.component';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './offering-coverages.component.html',
  styleUrls: ['./offering-coverages.component.scss'],
  imports: [
    CommonModule,
    HeaderTitleComponent,
    TranslateTextComponent,
    NxCopytextComponent,
    NxExpansionPanelComponent,
    NxExpansionPanelHeaderComponent,
    NxHeadlineComponent,
    NxTabComponent,
    NxTabGroupComponent,
    NxAccordionDirective,
    QuoteLiteralDirective
  ]
})
export class QuoteOfferingCoveragesComponent implements OnInit {
  public coverageSelectecd?: number;
  public selectedPriceIndex = 0;
  public prices: OfferingPriceModel[] = [];

  constructor(
    @Inject(NX_MODAL_DATA)
    public data: {
      prices: OfferingPriceModel[];
      selectedPriceIndex: number;
    }
  ) {}

  ngOnInit(): void {
    this.prices = this.data.prices ?? [];
    this.selectedPriceIndex = this.data.selectedPriceIndex ?? 0;
  }

  public onCoverageOpened(coverage: Coverage): void {
    this.coverageSelectecd = coverage.code;
  }
}
