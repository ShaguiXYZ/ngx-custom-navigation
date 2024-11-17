import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
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
  public yearsAsOwner: number[] = [1, 2, 3, 4, 5];

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.selectedYears = this._contextData.insuranceCompany?.yearsAsOwner;
    this.yearsAsOwner = this.yearsAsOwner.filter((value, index) => this.yearsAsOwner.indexOf(value) === index).sort((a, b) => a - b);
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectData(years: number): void {
    this._contextData.insuranceCompany.yearsAsOwner = years;
    this.routingService.next(this._contextData);
  }

  private updateValidData = (): boolean => !!this._contextData.insuranceCompany?.yearsAsOwner;
}
