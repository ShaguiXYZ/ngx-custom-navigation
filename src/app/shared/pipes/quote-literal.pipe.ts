import { inject, Pipe, PipeTransform } from '@angular/core';
import { LiteralModel, LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'quoteLiteral',
  standalone: true,
  pure: false // @howto: This pipe is impure because it depends on the language service
})
export class QuoteLiteralPipe implements PipeTransform {
  private readonly literalsService = inject(LiteralsService);

  public transform(literal: LiteralModel, params?: LiteralParam): string {
    return this.literalsService.toString(
      typeof literal === 'string' || typeof literal === 'number' ? { value: `${literal}`, params, type: 'literal' } : literal,
      params
    );
  }
}
