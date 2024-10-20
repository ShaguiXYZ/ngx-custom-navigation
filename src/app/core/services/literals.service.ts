import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataInfo } from '@shagui/ng-shagui/core';
import { LiteralModel, LiteralParam, QuoteLiteral } from '../models';

@Injectable({ providedIn: 'root' })
export class LiteralsService {
  private readonly translateService = inject(TranslateService);

  public toString(literal?: LiteralModel, params?: LiteralParam): string {
    if (!literal) {
      return '';
    }

    const normalizedParams = params
      ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, this.toString(value)]) as [string, string][])
      : undefined;

    return typeof literal === 'string'
      ? this.getValue(literal, normalizedParams)
      : this.isQuoteLiteral(literal)
      ? this.getLiteral(literal, normalizedParams)
      : literal;
  }

  private isQuoteLiteral = (literal?: QuoteLiteral): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getValue = (literal: string, params?: DataInfo): string => {
    const keys = Object.keys(params || {});

    if (keys.length === 0) {
      return literal;
    }

    return keys.reduce((acc, key) => acc.replace(new RegExp(`{{${key}}}`, 'g'), params?.[key] ?? ''), literal);
  };

  private getLiteral = (literal: QuoteLiteral, params?: DataInfo): string =>
    literal?.type === 'translate' ? this.translateService.instant(literal.value, params) : this.getValue(literal.value, params);
}
