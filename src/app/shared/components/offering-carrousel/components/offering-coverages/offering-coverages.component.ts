import { NxAccordionDirective, NxExpansionPanelComponent, NxExpansionPanelHeaderComponent } from '@allianz/ng-aquila/accordion';
import { NxCopytextComponent } from '@allianz/ng-aquila/copytext';
import { NxHeadlineComponent } from '@allianz/ng-aquila/headline';
import { NX_MODAL_DATA } from '@allianz/ng-aquila/modal';
import { NxTabComponent, NxTabGroupComponent } from '@allianz/ng-aquila/tabs';

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Coverage, OfferingPriceModel } from '../../../../../core/models';
import { QuoteLiteralDirective } from '../../../../directives';
import { HeaderTitleComponent } from '../../../header-title';
import { TranslateTextComponent } from '../../../translate-text/translate-text.component';

@Component({
  selector: 'quote-offering-coverages',
  templateUrl: './offering-coverages.component.html',
  styleUrls: ['./offering-coverages.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
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
  data = inject<{
    prices: OfferingPriceModel[];
    selectedPriceIndex: number;
}>(NX_MODAL_DATA);

  public coverageSelectecd?: number;
  public selectedPriceIndex = 0;
  public prices: OfferingPriceModel[] = [];

  ngOnInit(): void {
    this.prices = this.data.prices ?? [];
    this.selectedPriceIndex = this.data.selectedPriceIndex ?? 0;
  }

  public onCoverageOpened(coverage: Coverage): void {
    this.coverageSelectecd = coverage.code;
  }
}
