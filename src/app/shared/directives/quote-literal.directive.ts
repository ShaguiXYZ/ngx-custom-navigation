import { Directive, ElementRef, inject, Input, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, LiteralModel, Page, QuoteLiteral } from 'src/app/core/models';

@Directive({
  selector: '[uiQuoteLiteral]',
  standalone: true
})
export class QuoteLiteralDirective {
  @Input()
  public uiQuoteLiteral!: string;

  @Input()
  public contentAsDefault = true;

  private lastPage?: Page;

  private readonly contextDataService = inject(ContextDataService);
  private readonly translateService = inject(TranslateService);

  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    this.lastPage = appContextData.navigation.lastPage;
  }

  ngAfterViewInit(): void {
    if (this.uiQuoteLiteral && this.lastPage) {
      const literal = this.lastPage.configuration?.literals?.[this.uiQuoteLiteral];
      this.updateElement(literal);
    }
  }

  private updateElement(literal?: LiteralModel): void {
    if (typeof literal === 'string') {
      this.renderer.setProperty(this.el.nativeElement, 'innerText', literal);
    } else if (this.isQuoteLiteral(literal)) {
      this.renderer.setProperty(this.el.nativeElement, 'innerText', this.getLiteral(literal));
    } else if (!this.contentAsDefault) {
      // remove the element from the DOM
      this.el.nativeElement.parentElement?.removeChild(this.el.nativeElement);
    }
  }

  private isQuoteLiteral = (literal: any): literal is QuoteLiteral => typeof literal === 'object' && 'value' in literal;

  private getLiteral = (literal: QuoteLiteral): string => {
    return literal?.type === 'translate' ? this.translateService.instant(literal.value) : literal.value;
  };
}
