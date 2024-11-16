import { HttpStatusCode } from '@angular/common/http';

export class HttpError extends Error {
  public statusText: string;

  constructor(public status: HttpStatusCode, public override message: string, public url: string, public method: string) {
    super(message);
    this.name = 'HttpError';
    this.statusText = HttpStatusCode[status] || message;
  }
}
