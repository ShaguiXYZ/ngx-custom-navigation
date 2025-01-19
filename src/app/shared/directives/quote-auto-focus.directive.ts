import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

/**
 * Directive to set focus on an input element when it is rendered.
 */
@Directive({
  selector: '[nxAutoFocus]'
})
export class QuoteAutoFocusDirective implements OnInit {
  constructor(private readonly el: ElementRef<HTMLElement>, private readonly renderer: Renderer2) {}

  public ngOnInit(): void {
    Promise.resolve().then(() => {
      const value = this.el.nativeElement instanceof HTMLInputElement ? this.el.nativeElement.value : undefined;
      const someInputHasFocus = document.activeElement instanceof HTMLInputElement;

      if (!someInputHasFocus && !value && (this.el.nativeElement.tabIndex >= 0 || this.el.nativeElement.hasAttribute('tabindex'))) {
        this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
        this.el.nativeElement.focus();
      }
    });
  }
}
