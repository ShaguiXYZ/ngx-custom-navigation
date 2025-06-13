import { inject, Injectable, OnDestroy } from '@angular/core';
import { ContextDataService, DataInfo, JsonUtils } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../constants';
import { ConditionEvaluation } from '../lib';
import { AppContextData, LiteralModel, LiteralParam, QuoteLiteral } from '../models';
import { LanguageService } from './language.service';
import { Subject, Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiteralsService implements OnDestroy {
  private readonly languageChange$ = new Subject<string>();
  private readonly subscrition$: Subscription;

  private readonly contextDataService = inject(ContextDataService);
  private readonly languageService = inject(LanguageService);

  constructor() {
    this.subscrition$ = this.languageService.asObservable().subscribe(this.languageChange$.next.bind(this.languageChange$));
  }

  ngOnDestroy(): void {
    this.subscrition$.unsubscribe();
  }

  public onLanguageChange() {
    return this.languageChange$.asObservable();
  }

  public toString = (literal?: LiteralModel, params?: LiteralParam): string => {
    if (!literal) {
      return '';
    }

    const strLiteral = (() => {
      if (typeof literal === 'number') {
        return literal.toString();
      }

      if (typeof literal === 'string') {
        return this.getValue(literal, this.normalizeParams(params));
      }

      if (
        this.isQuoteLiteral(literal) &&
        ConditionEvaluation.checkConditions(this.contextDataService.get(QUOTE_CONTEXT_DATA), literal.conditions)
      ) {
        return this.getLiteral(literal, this.normalizeParams({ ...params, ...literal.params })) ?? '';
      }

      return '';
    })();

    return strLiteral.replaceAll(/{{.*?}}/g, '');
    // return strLiteral?.replaceAll(/{{[^ ]*?}}/g, '');
  };

  public transformLiteral = (literalKey: string, params?: LiteralParam): string => {
    const contextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const pageLiterals = { ...contextData.configuration.literals, ...contextData.navigation.lastPage?.configuration?.literals };
    const value = pageLiterals[literalKey];

    return value ? this.toString(value, params) : '';
  };

  private isQuoteLiteral = (literal?: QuoteLiteral): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getValue = (literal: string, params?: DataInfo): string => {
    if (!params) {
      return literal;
    }

    return Object.entries(params).reduce((acc, [key, value]) => acc.replaceAll(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value), literal);
  };

  private getLiteral = (literal: QuoteLiteral, params?: DataInfo): string => {
    switch (literal.type) {
      case 'translate': {
        const normalizedParams = { ...params, ...this.normalizeParams(literal.params) };
        return this.languageService.instant(literal.value, normalizedParams);
      }
      case 'literal':
        return this.transformLiteral(literal.value, literal.params);
      case 'data':
        return `${JsonUtils.get(this.contextDataService.get(QUOTE_CONTEXT_DATA), literal.value) ?? ''}`;
      default: {
        const normalizedParams = { ...params, ...this.normalizeParams(literal.params) };
        return this.getValue(literal.value, normalizedParams);
      }
    }
  };

  private normalizeParams = (params?: LiteralParam): DataInfo =>
    params ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, this.toString(value)]) as [string, string][]) : {};
}
