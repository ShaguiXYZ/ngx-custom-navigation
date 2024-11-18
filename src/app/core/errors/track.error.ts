import { TrackInfo } from '../tracking';

export class TrackError extends Error {
  constructor(message: string, public event: string, public data?: TrackInfo) {
    super(message);
    this.name = 'TrackError';
  }
}
