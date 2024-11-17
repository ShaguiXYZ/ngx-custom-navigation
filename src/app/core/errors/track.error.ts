import { TrackInfo } from '../tracking';

export class TrackError extends Error {
  constructor(message: string, public event: string, public data?: Partial<TrackInfo>) {
    super(message);
    this.name = 'TrackError';
  }
}
