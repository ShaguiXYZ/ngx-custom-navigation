import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { QUOTE_MASK, QuoteMaskType } from '../models';

@Directive({
  selector: '[uiQuoteMask]',
  standalone: true
})
export class QuoteMaskDirective {
  @Input()
  public value!: string;

  @Output()
  public uiValueMatch: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _mask!: QuoteMaskType;

  private readonly specialKeys: Set<string> = new Set(['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete']);

  constructor(private el: ElementRef) {}

  @Input()
  public set uiQuoteMask(value: QuoteMaskType) {
    this._mask = value;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.has(event.key)) {
      return;
    }

    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    const maskRegex = QUOTE_MASK[this._mask];
    const valueMatch = !!maskRegex.match(next);

    this.uiValueMatch.emit(valueMatch);

    if (maskRegex.preventEdition() && !valueMatch) {
      event.preventDefault();
    }
  }
}
