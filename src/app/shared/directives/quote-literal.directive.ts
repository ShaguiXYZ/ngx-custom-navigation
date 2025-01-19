import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LiteralParam } from 'src/app/core/models';
import { LiteralsService } from 'src/app/core/services';

@Directive({
  selector: '[nxQuoteLiteral]'
})
export class QuoteLiteralDirective implements AfterViewInit, OnDestroy {
  @Input()
  public nxQuoteLiteral!: string;

  @Input()
  public nxQuoteLitealParams?: LiteralParam;

  @Input()
  public nxQuoteDefaultLiteral?: string;

  private readonly subscrition$: Subscription;

  constructor(
    private readonly literalsService: LiteralsService,
    private readonly el: ElementRef<HTMLElement>,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.subscrition$ = this.literalsService.onLanguageChange().subscribe(() => this.updateElement());
  }

  ngOnDestroy(): void {
    this.subscrition$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.updateElement();
  }

  private updateElement(): void {
    const soureceLiteral = this.el.nativeElement.innerHTML;
    const value = this.literalsService.transformLiteral(this.nxQuoteLiteral, this.nxQuoteLitealParams) || this.nxQuoteDefaultLiteral;
    const toSanitize = value || soureceLiteral;

    this.el.nativeElement.innerHTML = this.domSanitizer.sanitize(1, toSanitize) ?? '';
  }
}
