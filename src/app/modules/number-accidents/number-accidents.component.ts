import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-number-accidents',
  templateUrl: './number-accidents.component.html',
  styleUrl: './number-accidents.component.scss',
  standalone: true,
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    TextCardComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ]
})
export class NumberAccidentsComponent extends QuoteComponent implements OnInit {
  public selectedAccidents?: number;
  public yearsAsOwner = 5;
  public accidents: number[] = [0, 1, 2, 3, 4];

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.yearsAsOwner = this.contextData.insuranceCompany.yearsAsOwner || this.yearsAsOwner;
    this.selectedAccidents = this.contextData.client.accidents;

    // @howto - Remove duplicates and sort the accidents array
    this.accidents = this.accidents.filter((value, index) => this.accidents.indexOf(value) === index).sort((a, b) => a - b);
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectAccidents(accidents: number): void {
    this.contextData.client.accidents = accidents;
    this.populateContextData();

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => hasValue(this.contextData.client.accidents);
}
