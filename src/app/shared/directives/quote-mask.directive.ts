import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { QUOTE_MASK, QuoteMaskType } from '../models';

@Directive({
  selector: '[quoteMask]',
  standalone: true
})
export class QuoteMaskDirective {
  public _mask!: QuoteMaskType;

  private readonly specialKeys: Set<string> = new Set(['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete']);

  constructor(private el: ElementRef) {}

  @Input()
  public set quoteMask(value: QuoteMaskType) {
    this._mask = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.has(event.key)) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);

    if (!QUOTE_MASK[this._mask].match(next)) {
      event.preventDefault();
    }
  }
}
