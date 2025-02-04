import { _Error } from './_error.model';

export class JourneyError extends _Error {
  constructor(public override message: string) {
    super(message);
    this.name = 'JourneyError';
  }
}
