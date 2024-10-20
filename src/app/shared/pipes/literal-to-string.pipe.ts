import { inject, Pipe } from '@angular/core';
import { LiteralModel, LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'literalToString',
  standalone: true
})
export class LiteralToStringPipe {
  private readonly literalsService = inject(LiteralsService);

  public transform = (value: LiteralModel, params?: LiteralParam): string => {
    return this.literalsService.toString(value, params);
  };
}
