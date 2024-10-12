import { inject, Input, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteLiteral } from 'src/app/core/models';

import { Pipe } from '@angular/core';

@Pipe({
  name: 'quoteLiteral',
  standalone: true
})
export class QuoteLiteralPipe implements PipeTransform {
  @Input()
  public uiQuoteLiteral!: string;

  private readonly contextDataService = inject(ContextDataService);
  private readonly translateService = inject(TranslateService);

  public transform = (literal: string, params?: { [key: string]: any }): string => {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = appContextData.navigation.lastPage;
    const literals = { ...appContextData.configuration.literals, ...lastPage?.configuration?.literals };
    const value = literals[literal];

    if (!value) {
      return '';
    }

    return typeof value === 'string' ? this.getValue(value, params) : this.isQuoteLiteral(value) ? this.getLiteral(value, params) : '';
  };

  private isQuoteLiteral = (literal?: QuoteLiteral): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getValue = (literal: string, params?: { [key: string]: any }): string => {
    const keys = Object.keys(params || {});

    if (keys.length === 0) {
      return literal;
    }

    return keys.reduce((acc, key) => acc.replace(new RegExp(`{{${key}}}`, 'g'), params?.[key] ?? ''), literal);
  };

  private getLiteral = (literal: QuoteLiteral, params?: {}): string =>
    literal?.type === 'translate' ? this.translateService.instant(literal.value, params) : literal.value;
}
