import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { QuoteLiteralPipe } from '../pipes';
import { LiteralParam } from 'src/app/core/models';

@Directive({
  selector: '[uiQuoteLiteral]',
  providers: [QuoteLiteralPipe],
  standalone: true
})
export class QuoteLiteralDirective {
  @Input()
  public uiQuoteLiteral!: string;

  @Input()
  public uiQuoteLitealParams?: LiteralParam;

  @Input()
  public uiQuoteDefaultLiteral: string = '';

  @Input()
  public uiAttribute?: string;

  @Input()
  public uiProperty: string = 'innerText';

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly literalPipe: QuoteLiteralPipe
  ) {}

  ngAfterViewInit(): void {
    this.updateElement();
  }

  private updateElement(): void {
    const value = this.literalPipe.transform(this.uiQuoteLiteral, this.uiQuoteLitealParams) || this.uiQuoteDefaultLiteral;

    if (this.uiAttribute) {
      this.renderer.setAttribute(this.el.nativeElement, this.uiAttribute, value);
      return;
    }

    if (this.uiProperty === 'innerHTML' || this.uiProperty === 'innerText') {
      const soureceLiteral = this.el.nativeElement[this.uiProperty];
      this.el.nativeElement[this.uiProperty] = `${value} ${soureceLiteral}`;
    } else {
      this.renderer.setProperty(this.el.nativeElement, this.uiProperty, value);
    }
  }
}
