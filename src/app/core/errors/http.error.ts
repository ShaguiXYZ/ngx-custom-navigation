import { HttpStatusCode } from '@angular/common/http';

export class HttpError extends Error {
  public statusText: string;

  constructor(public status: HttpStatusCode, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusText = HttpStatusCode[status] || message;
  }
}
