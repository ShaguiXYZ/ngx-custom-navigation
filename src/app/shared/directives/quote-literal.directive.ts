import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Page, QuoteLiteral } from 'src/app/core/models';

@Directive({
  selector: '[quoteLiteral]',
  standalone: true
})
export class QuoteLiteralDirective {
  @Input()
  public quoteLiteral!: string;

  private lastPage?: Page;

  private readonly contextDataService = inject(ContextDataService);
  private readonly translateService = inject(TranslateService);

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    this.lastPage = appContextData.navigation.lastPage;
  }

  ngAfterViewInit(): void {
    if (this.quoteLiteral && this.lastPage) {
      const literal = this.lastPage.configuration?.literals?.[this.quoteLiteral];

      if (typeof literal === 'string') {
        this.renderer.setProperty(this.el.nativeElement, 'innerText', literal);
      } else if (this.isQuoteLiteral(literal)) {
        this.renderer.setProperty(this.el.nativeElement, 'innerText', this.getLiteral(literal));
      }
    }
  }

  private isQuoteLiteral = (literal: any): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getLiteral = (literal: QuoteLiteral): string => {
    if (literal?.type === 'translate') {
      return this.translateService.instant(literal.value);
    } else {
      return literal.value;
    }
  };
}
