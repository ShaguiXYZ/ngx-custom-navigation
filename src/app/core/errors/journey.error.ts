export class JourneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JourneyError';
  }
}
