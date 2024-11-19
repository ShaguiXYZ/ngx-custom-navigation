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

    const strLiteral = (() => {
      if (typeof literal === 'number') {
        return literal.toString();
      }

      if (typeof literal === 'string') {
        return this.getValue(literal, normalizedParams);
      }

      if (this.isQuoteLiteral(literal)) {
        return this.getLiteral(literal, normalizedParams) ?? '';
      }

      return '';
    })();

    return strLiteral.replaceAll(/{{.*?}}/g, '');
    // return strLiteral?.replaceAll(/{{[^ ]*?}}/g, '');
  }

  private isQuoteLiteral = (literal?: QuoteLiteral): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getValue = (literal: string, params?: DataInfo): string => {
    if (!params) {
      return literal;
    }

    return Object.entries(params).reduce((acc, [key, value]) => acc.replaceAll(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value), literal);
  };

  private getLiteral = (literal: QuoteLiteral, params?: DataInfo): string =>
    literal?.type === 'translate' ? this.translateService.instant(literal.value, params) : this.getValue(literal.value, params);
}
