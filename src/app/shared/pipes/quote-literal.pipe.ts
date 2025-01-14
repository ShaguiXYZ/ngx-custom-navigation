import { inject, Input, Pipe, PipeTransform } from '@angular/core';
import { LiteralModel, LiteralParam, QuoteLiteral } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'quoteLiteral',
  standalone: true
})
export class QuoteLiteralPipe implements PipeTransform {
  @Input()
  public nxQuoteLiteral!: string;

  private readonly literalsService = inject(LiteralsService);

  public transform(literal: LiteralModel, params?: LiteralParam): string {
    const literalValue: QuoteLiteral =
      typeof literal === 'string' || typeof literal === 'number' ? { value: `${literal}`, params, type: 'literal' } : literal;

    return this.literalsService.toString(literalValue, params);
  }
}
