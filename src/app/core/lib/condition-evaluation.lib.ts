import { JsonUtils } from '@shagui/ng-shagui/core';
import { CompareOperations, Condition } from '../models';

export class ConditionEvaluation {
  /**
   * Verifica si se cumplen las condiciones
   */
  public static checkConditions = <T = unknown>(data: T, conditions?: Condition[]): boolean =>
    conditions?.reduce((isValid: boolean, current: Condition) => {
      const currentEval = this.evalCondition(data, current);

      return this.applyPreviousEval(isValid, currentEval, current.union);
    }, true) ?? true;

  private static evalCondition = <T>(data: T, condition: Condition): boolean => {
    try {
      const contextExp = this.dataItemValue(data, condition.expression);

      return typeof contextExp === 'string'
        ? (0, eval)(`'${this.dataItemValue(data, condition.expression)}'${condition.operation ?? '==='}'${condition.value}'`)
        : (0, eval)(`${this.dataItemValue(data, condition.expression)}${condition.operation ?? '==='}${condition.value}`);
    } catch (error) {
      console.group('ConditionService');
      console.error(`Error evaluating condition: ${error}`);
      console.error(`Condition: ${JSON.stringify(condition)}`);
      console.groupEnd();

      return false;
    }
  };

  private static dataItemValue = <T>(data: T, key: string): unknown => JsonUtils.valueOf(data, key);

  private static applyPreviousEval = (previous: boolean, current: boolean, union?: CompareOperations): boolean =>
    (union &&
      {
        ['AND']: previous && current,
        ['OR']: previous || current
      }[union]) ??
    current;
}
