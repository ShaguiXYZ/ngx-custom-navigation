import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Directive({
  selector: '[nxQuoteLiteral]',
  standalone: true
})
export class QuoteLiteralDirective implements AfterViewInit {
  @Input()
  public nxQuoteLiteral!: string;

  @Input()
  public nxQuoteLitealParams?: LiteralParam;

  @Input()
  public nxQuoteDefaultLiteral?: string;

  constructor(
    private readonly literalsService: LiteralsService,
    private readonly el: ElementRef<HTMLElement>,
    private readonly domSanitizer: DomSanitizer
  ) {}

  ngAfterViewInit(): void {
    this.updateElement();
  }

  private updateElement(): void {
    const soureceLiteral = this.el.nativeElement.innerHTML;
    const value = this.literalsService.transformLiteral(this.nxQuoteLiteral, this.nxQuoteLitealParams) || this.nxQuoteDefaultLiteral;
    const safeHtml = this.domSanitizer.bypassSecurityTrustHtml(value ?? soureceLiteral);

    this.el.nativeElement.innerHTML = this.domSanitizer.sanitize(1, safeHtml) ?? '';
  }
}
