import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from 'src/app/core/models';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'quote-number-accidents',
  templateUrl: './number-accidents.component.html',
  styleUrl: './number-accidents.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteFooterInfoComponent,
    SelectableOptionComponent,
    NxCopytextModule,
    ReactiveFormsModule,
    QuoteLiteralDirective
  ]
})
export class NumberAccidentsComponent extends QuoteComponent implements OnInit {
  public selectedAccidents?: number;
  public accidents: number[] = [1, 2, 3, 4];

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
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
