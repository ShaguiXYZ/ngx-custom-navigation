import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LiteralModel, QuoteLiteral } from '../models';

@Injectable({ providedIn: 'root' })
export class LiteralsService {
  private readonly translateService = inject(TranslateService);

  public toString(literal: LiteralModel, params?: { [key: string]: any }): string {
    if (!literal) {
      return '';
    }

    return typeof literal === 'string'
      ? this.getValue(literal, params)
      : this.isQuoteLiteral(literal)
      ? this.getLiteral(literal, params)
      : literal;
  }

  private isQuoteLiteral = (literal?: QuoteLiteral): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getValue = (literal: string, params?: { [key: string]: any }): string => {
    const keys = Object.keys(params || {});

    if (keys.length === 0) {
      return literal;
    }

    return keys.reduce((acc, key) => acc.replace(new RegExp(`{{${key}}}`, 'g'), params?.[key] ?? ''), literal);
  };

  private getLiteral = (literal: QuoteLiteral, params?: {}): string =>
    literal?.type === 'translate' ? this.translateService.instant(literal.value, params) : this.getValue(literal.value, params);
}
