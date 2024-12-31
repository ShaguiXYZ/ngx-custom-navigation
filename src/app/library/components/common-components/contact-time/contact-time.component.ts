import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { QuoteComponent } from 'src/app/core/components';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { Hour, QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-contact-time',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteZoneComponent,
    TextCardComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteTrackDirective
  ],
  templateUrl: './contact-time.component.html',
  styleUrl: './contact-time.component.scss'
})
export class ContactTimeComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public hours: { am: Hour[]; pm: Hour[] } = {
    // AM hours
    am: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00'],
    // PM hours
    pm: ['14:00', '15:00', '16:00', '17:00', '18:00', '19:00']
  };

  public selectedHour?: Hour;

  ngOnInit(): void {
    this.selectedHour = this._contextData.contactData.contactHour;
  }

  public override canDeactivate = (): boolean => !!this.selectedHour;

  public selectHour(hour: Hour): void {
    this.selectedHour = hour;
  }

  public updateValidData = (): void => {
    this._contextData.contactData.contactHour = this.selectedHour;
  };
}
