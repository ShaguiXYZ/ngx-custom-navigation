import { HttpStatusCode } from '@angular/common/http';
import { _Error } from './_error.model';

export class HttpError extends _Error {
  public statusText: string;

  constructor(
    public status: HttpStatusCode,
    public override message: string,
    public url?: string | null,
    public method?: string | null,
    public override critical = true
  ) {
    super(message, critical);
    this.name = 'HttpError';
    this.statusText = HttpStatusCode[status] || message;
  }
}
