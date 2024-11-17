import { Condition } from '../../models';
import { ConditionEvaluation } from '../condition-evaluation.lib';

describe('ConditionEvaluation', () => {
  it('should return true when no conditions are provided', () => {
    const result = ConditionEvaluation.checkConditions({});
    expect(result).toBe(true);
  });

  it('should evaluate a single condition correctly', () => {
    const conditions: Condition[] = [{ expression: 'age', operation: '>', value: 18 }];
    const data = { age: 20 };
    const result = ConditionEvaluation.checkConditions(data, conditions);
    expect(result).toBe(true);
  });

  it('should evaluate multiple conditions with AND correctly', () => {
    const conditions: Condition[] = [
      { expression: 'age', operation: '>', value: 18 },
      { expression: 'name', operation: '===', value: 'John', union: 'AND' }
    ];
    const data = { age: 20, name: 'John' };
    const result = ConditionEvaluation.checkConditions(data, conditions);
    expect(result).toBe(true);
  });

  it('should evaluate multiple conditions with OR correctly', () => {
    const conditions: Condition[] = [
      { expression: 'age', operation: '>', value: 18 },
      { expression: 'name', operation: '===', value: 'Doe', union: 'OR' }
    ];
    const data = { age: 20, name: 'John' };
    const result = ConditionEvaluation.checkConditions(data, conditions);

    expect(result).toBe(true);
  });

  it('should return false if a condition fails', () => {
    const conditions: Condition[] = [
      { expression: 'age', operation: '>', value: 18 },
      { expression: 'name', operation: '===', value: 'Doe' }
    ];
    const data = { age: 20, name: 'John' };
    const result = ConditionEvaluation.checkConditions(data, conditions);
    expect(result).toBe(false);
  });

  it('should throw a ConditionError if an error occurs while evaluating a condition', () => {
    const conditions: Condition[] = [{ expression: 'age', operation: '><', value: 18 }];
    const data = { age: 'twenty' };
    expect(() => ConditionEvaluation.checkConditions(data, conditions)).toThrowError();
  });
});
