import { inject, Injectable } from '@angular/core';
import { ContextDataService, JsonUtils } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from '../constants';
import { CompareOperations, Condition, QuoteModel } from '../models';

@Injectable({ providedIn: 'root' })
export class ConditionService {
  private contextDataService = inject(ContextDataService);

  /**
   * Verifica si se cumplen las condiciones
   */
  public checkConditions = (conditions?: Condition[]): boolean =>
    conditions?.reduce((isValid: boolean, current: Condition) => {
      const currentEval = this.evalCondition(current);

      return this.applyPreviousEval(isValid, currentEval, current.union);
    }, true) ?? true;

  private evalCondition = (condition: Condition): boolean => {
    try {
      const contextExp = this.contextDataItemValue(condition.expression);

      return typeof contextExp === 'string'
        ? (0, eval)(`'${this.contextDataItemValue(condition.expression)}'${condition.operation ?? '==='}'${condition.value}'`)
        : (0, eval)(`${this.contextDataItemValue(condition.expression)}${condition.operation ?? '==='}${condition.value}`);
    } catch (error) {
      console.group('ConditionService');
      console.error(`Error evaluating condition: ${error}`);
      console.error(`Condition: ${JSON.stringify(condition)}`);
      console.groupEnd();

      return false;
    }
  };

  private contextDataItemValue = (key: string): unknown =>
    JsonUtils.valueOf(this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA), key);

  private applyPreviousEval = (previous: boolean, current: boolean, union?: CompareOperations): boolean =>
    (union &&
      {
        ['AND']: previous && current,
        ['OR']: previous || current
      }[union]) ??
    current;
}
