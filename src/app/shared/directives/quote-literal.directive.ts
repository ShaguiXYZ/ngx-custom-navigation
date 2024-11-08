import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { QuoteLiteralPipe } from '../pipes';
import { LiteralParam } from 'src/app/core/models';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[nxQuoteLiteral]',
  providers: [QuoteLiteralPipe],
  standalone: true
})
export class QuoteLiteralDirective implements AfterViewInit {
  @Input()
  public nxQuoteLiteral!: string;

  @Input()
  public uiQuoteLitealParams?: LiteralParam;

  @Input()
  public uiQuoteDefaultLiteral = '';

  @Input()
  public uiAttribute?: string;

  @Input()
  public uiProperty = 'innerHTML';

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
    private readonly literalPipe: QuoteLiteralPipe,
    private readonly domSanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    this.updateElement();
  }

  private updateElement(): void {
    const value = this.literalPipe.transform(this.nxQuoteLiteral, this.uiQuoteLitealParams) || this.uiQuoteDefaultLiteral;

    if (this.uiAttribute) {
      this.renderer.setAttribute(this.el.nativeElement, this.uiAttribute, value);
      return;
    }

    if (this.uiProperty === 'innerHTML' || this.uiProperty === 'innerText') {
      const soureceLiteral = this.el.nativeElement[this.uiProperty];
      const safeHtml = this.domSanitizer.bypassSecurityTrustHtml(`${value} ${soureceLiteral}`);

      this.el.nativeElement[this.uiProperty] = this.domSanitizer.sanitize(1, safeHtml) || '';
    } else {
      this.renderer.setProperty(this.el.nativeElement, this.uiProperty, value);
    }
  }
}
