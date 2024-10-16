import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { Hour, QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'quote-contact-time',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    TextCardComponent,
    SelectableOptionComponent,
    NxCopytextModule,
    QuoteLiteralDirective
  ],
  templateUrl: './contact-time.component.html',
  styleUrl: './contact-time.component.scss'
})
export class ContactTimeComponent implements OnInit, IsValidData {
  public hours: { am: Hour[]; pm: Hour[] } = {
    // AM hours
    am: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    // PM hours
    pm: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
  };

  public selectedHour?: Hour;

  private contextData!: QuoteModel;

  private readonly contextDataService = inject(ContextDataService);

  constructor() {}

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
    this.selectedHour = this.contextData.contactData.contactHour;
  }

  public canDeactivate = (): boolean => !!this.selectedHour;

  public selectHour(hour: Hour): void {
    this.selectedHour = hour;
  }

  public updateValidData = (): void => {
    this.contextData.contactData.contactHour = this.selectedHour;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);
  };
}
