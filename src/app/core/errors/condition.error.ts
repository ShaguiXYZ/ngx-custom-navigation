import { Condition } from '../models';

export class ConditionError extends Error {
  constructor(message: string, public readonly condition: Condition) {
    super(message);
    this.name = 'ConditionError';
  }
}
