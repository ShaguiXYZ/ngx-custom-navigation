export class QuoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuoteError';
  }
}
