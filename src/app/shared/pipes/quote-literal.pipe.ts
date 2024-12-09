import { inject, Input, Pipe, PipeTransform } from '@angular/core';
import { LiteralModel, LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'quoteLiteral',
  standalone: true
})
export class QuoteLiteralPipe implements PipeTransform {
  @Input()
  public nxQuoteLiteral!: string;

  private readonly literalsService = inject(LiteralsService);

  public transform = (literal: LiteralModel, params?: LiteralParam): string => {
    if (typeof literal === 'string') {
      return this.literalsService.toString({ value: `${literal}`, params, type: 'literal' });
    }

    return this.literalsService.toString(literal, params);
  };
}
