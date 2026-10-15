import { NxCopytextModule } from '@allianz/ng-aquila/copytext';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { QuoteComponent } from '../../../../core/components';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, QuoteZoneComponent, TextCardComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { Hour, QuoteModel } from '../../../models';

@Component({
  selector: 'quote-contact-time',
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    QuoteZoneComponent,
    TextCardComponent,
    NxCopytextModule,
    QuoteLiteralDirective,
    QuoteTrackDirective
],
  templateUrl: './contact-time.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
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
