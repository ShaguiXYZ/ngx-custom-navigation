import { _Error } from './_error.model';

export class BudgetError extends _Error {
  constructor(public override message: string) {
    super(message);
    this.name = 'BudgetError';
  }
}
