import { ChangeDetectorRef, Directive, ElementRef, OnInit, Renderer2, inject } from '@angular/core';

/**
 * Directive to set focus on an input element when it is rendered.
 */
@Directive({
  selector: '[nxAutoFocus]'
})
export class QuoteAutoFocusDirective implements OnInit {
  private readonly cd = inject(ChangeDetectorRef);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit(): void {
    Promise.resolve().then(() => {
      const value = this.el.nativeElement instanceof HTMLInputElement ? this.el.nativeElement.value : undefined;
      const someInputHasFocus = document.activeElement instanceof HTMLInputElement;

      if (!someInputHasFocus && !value && (this.el.nativeElement.tabIndex >= 0 || this.el.nativeElement.hasAttribute('tabindex'))) {
        this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
        this.renderer.selectRootElement(this.el.nativeElement).focus();
        this.cd.detectChanges();
      }
    });
  }
}
