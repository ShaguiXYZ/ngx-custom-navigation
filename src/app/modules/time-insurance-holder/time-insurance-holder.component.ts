import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-time-insurance-holder',
  templateUrl: './time-insurance-holder.component.html',
  styleUrl: './time-insurance-holder.component.scss',
  standalone: true,
  imports: [HeaderTitleComponent, TextCardComponent, NxCopytextModule, QuoteLiteralDirective, QuoteLiteralPipe]
})
export class TimeInsuranceHolderComponent extends QuoteComponent implements OnInit {
  public selectedYears?: number;
  public yearsAsOwner: number[] = [1, 2, 3, 4];

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedYears = this.contextData.insuranceCompany?.yearsAsOwner;
    this.yearsAsOwner = this.yearsAsOwner.sort((a, b) => a - b);
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectData(years: number): void {
    this.contextData.insuranceCompany.yearsAsOwner = years;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => !!this.contextData.insuranceCompany?.yearsAsOwner;
}
