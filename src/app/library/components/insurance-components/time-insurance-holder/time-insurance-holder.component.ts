import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { TimeInsuranceHolder } from './models';

@Component({
  selector: 'quote-time-insurance-holder',
  templateUrl: './time-insurance-holder.component.html',
  styleUrl: './time-insurance-holder.component.scss',
  standalone: true,
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
