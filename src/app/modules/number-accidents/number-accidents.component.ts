import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteFooterInfoComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-number-accidents',
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
  ],
  providers: [{ provide: NX_DATE_LOCALE, useValue: 'es-ES' }]
})
export class NumberAccidentsComponent implements OnInit, IsValidData {
  public selectedAccidents?: number;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedAccidents = this.contextData.client.accidents;
  }

  public canDeactivate = (): boolean => this.updateValidData();

  public selectAccidents(accidents: number): void {
    this.contextData.client.accidents = accidents;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  private updateValidData = (): boolean => hasValue(this.contextData.client.accidents);
}
