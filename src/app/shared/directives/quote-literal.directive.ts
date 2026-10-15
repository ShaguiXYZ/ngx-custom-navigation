import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LiteralParam } from '../../core/models';
import { LiteralsService } from '../../core/services';

@Directive({
  selector: '[nxQuoteLiteral]'
})
export class QuoteLiteralDirective implements AfterViewInit, OnDestroy {
  private readonly literalsService = inject(LiteralsService);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly domSanitizer = inject(DomSanitizer);

  @Input()
  public nxQuoteLiteral!: string;

  @Input()
  public nxQuoteLitealParams?: LiteralParam;

  @Input()
  public nxQuoteDefaultLiteral?: string;

  private readonly subscrition$: Subscription;

  constructor() {
    this.subscrition$ = this.literalsService.onLanguageChange().subscribe(() => this.updateElement());
  }

  ngOnDestroy(): void {
    this.subscrition$.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.updateElement();
  }

  private updateElement(): void {
    const value = this.literalsService.transformLiteral(this.nxQuoteLiteral, this.nxQuoteLitealParams) || this.nxQuoteDefaultLiteral;
    const toSanitize = value || this.el.nativeElement.innerHTML;

    this.el.nativeElement.innerHTML = this.domSanitizer.sanitize(1, toSanitize) ?? '';
  }
}
