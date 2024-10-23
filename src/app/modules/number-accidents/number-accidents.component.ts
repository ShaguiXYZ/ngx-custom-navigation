import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
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
  public accidents: number[] = [1, 2, 3, 4];

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.yearsAsOwner = this.contextData.insuranceCompany.yearsAsOwner || this.yearsAsOwner;
    this.selectedAccidents = this.contextData.client.accidents;
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectAccidents(accidents: number): void {
    this.contextData.client.accidents = accidents;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => hasValue(this.contextData.client.accidents);
}
