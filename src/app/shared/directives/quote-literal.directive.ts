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
  public nxQuoteLitealParams?: LiteralParam;

  @Input()
  public nxQuoteDefaultLiteral = '';

  @Input()
  public nxAttribute?: string;

  @Input()
  public nxProperty = 'innerHTML';

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
    const value = this.literalPipe.transform(this.nxQuoteLiteral, this.nxQuoteLitealParams) || this.nxQuoteDefaultLiteral;

    if (this.nxAttribute) {
      this.renderer.setAttribute(this.el.nativeElement, this.nxAttribute, value);
      return;
    }

    if (this.nxProperty === 'innerHTML' || this.nxProperty === 'innerText') {
      const soureceLiteral = this.el.nativeElement[this.nxProperty];
      const safeHtml = this.domSanitizer.bypassSecurityTrustHtml(`${value} ${soureceLiteral}`);

      this.el.nativeElement[this.nxProperty] = this.domSanitizer.sanitize(1, safeHtml) || '';
    } else {
      this.renderer.setProperty(this.el.nativeElement, this.nxProperty, value);
    }
  }
}
