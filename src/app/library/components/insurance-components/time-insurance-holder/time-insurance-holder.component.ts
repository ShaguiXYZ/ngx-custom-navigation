import { NxCopytextModule } from '@allianz/ng-aquila/copytext';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';
import { TimeInsuranceHolder } from './models';

@Component({
  selector: 'quote-time-insurance-holder',
  templateUrl: './time-insurance-holder.component.html',
  styleUrl: './time-insurance-holder.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    HeaderTitleComponent,
    TextCardComponent,
    QuoteFooterComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteLiteralPipe
  ]
})
export class TimeInsuranceHolderComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public yearsAsOwner = TimeInsuranceHolder;
  public selectedYears?: IndexedData<string, number>;

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.selectedYears = this.yearsAsOwner.find(year => year.index === this._contextData.insuranceCompany?.yearsAsOwner);
    this.yearsAsOwner = this.yearsAsOwner.filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a.index - b.index);
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectData(type: IndexedData<string, number>) {
    this.selectedYears = type;
    this._contextData.insuranceCompany.yearsAsOwner = this.selectedYears?.index;

    this.routingService.next();
  }

  private updateValidData = (): boolean => !!this._contextData.insuranceCompany?.yearsAsOwner;
}
