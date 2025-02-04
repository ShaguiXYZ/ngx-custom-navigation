import { TrackInfo } from '../tracking';
import { _Error } from './_error.model';

export class TrackError extends _Error {
  constructor(public override message: string, public event: string, public data?: TrackInfo) {
    super(message);
    this.name = 'TrackError';
  }
}
