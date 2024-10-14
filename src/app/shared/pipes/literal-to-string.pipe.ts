import { inject, Pipe } from '@angular/core';
import { LiteralModel } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'literalToString',
  standalone: true
})
export class LiteralToStringPipe {
  private readonly literalsService = inject(LiteralsService);

  public transform = (value: LiteralModel, params?: { [key: string]: any }): string => {
    return this.literalsService.toString(value, params);
  };
}
