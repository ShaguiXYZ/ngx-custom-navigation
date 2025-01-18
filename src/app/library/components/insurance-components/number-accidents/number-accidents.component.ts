import { Component, inject, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { hasValue, IndexedData } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, TextCardComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { NumberAccidents } from './models';

@Component({
    selector: 'quote-number-accidents',
    templateUrl: './number-accidents.component.html',
    styleUrl: './number-accidents.component.scss',
    imports: [
        HeaderTitleComponent,
        QuoteFooterComponent,
        TextCardComponent,
        NxCopytextModule,
        QuoteLiteralDirective,
        QuoteTrackDirective,
        QuoteLiteralPipe
    ]
})
export class NumberAccidentsComponent extends QuoteComponent<QuoteModel> implements OnInit {
  public selectedAccidents?: IndexedData<string, number>;
  public accidents = NumberAccidents;

  private readonly routingService = inject(RoutingService);

  ngOnInit(): void {
    this.selectedAccidents = this.accidents.find(accident => accident.index === this._contextData.client?.accidents);

    // @howto - Remove duplicates and sort the accidents array
    this.accidents = this.accidents.filter((value, index, self) => self.indexOf(value) === index).sort((a, b) => a.index - b.index);
  }

  public override canDeactivate = (): boolean => this.updateValidData();

  public selectData(accidents: IndexedData<string, number>) {
    this.selectedAccidents = accidents;
    this._contextData.client.accidents = this.selectedAccidents?.index;

    this.routingService.next();
  }

  private updateValidData = (): boolean => hasValue(this._contextData.client.accidents);
}
