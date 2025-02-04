import { Condition } from '../models';
import { _Error } from './_error.model';

export class ConditionError extends _Error {
  constructor(public override message: string, public readonly condition: Condition) {
    super(message);
    this.name = 'ConditionError';
  }
}
