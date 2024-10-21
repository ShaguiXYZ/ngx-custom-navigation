import { inject, Input, Pipe, PipeTransform } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Pipe({
  name: 'quoteLiteral',
  standalone: true
})
export class QuoteLiteralPipe implements PipeTransform {
  @Input()
  public nxQuoteLiteral!: string;

  private readonly contextDataService = inject(ContextDataService);
  private readonly literalsService = inject(LiteralsService);

  public transform = (literal: string, params?: LiteralParam): string => {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = appContextData.navigation.lastPage;
    const literals = { ...appContextData.configuration.literals, ...lastPage?.configuration?.literals };
    const value = literals[literal];

    return this.literalsService.toString(value, params);
  };
}
