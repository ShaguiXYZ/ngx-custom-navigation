import { Component, inject, Input, OnInit } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ConditionEvaluation } from 'src/app/core/lib';
import { AppContextData } from 'src/app/core/models';

@Component({
  selector: 'quote-zone',
  template: `
    @if(!skipZoneLoad) {
    <ng-content></ng-content>
    }
  `,
  styleUrls: ['./quote-zone.component.scss']
})
export class QuoteZoneComponent implements OnInit {
  @Input()
  public name!: string;

  public skipZoneLoad?: boolean;

  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    const lastPage = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA)?.navigation?.lastPage;
    const zone = lastPage?.configuration?.zones?.[this.name];

    if (zone) {
      const quote = this.contextDataService.get(QUOTE_CONTEXT_DATA);
      this.skipZoneLoad = zone.skipLoad && ConditionEvaluation.checkConditions(quote, zone.conditions);
    }
  }
}
