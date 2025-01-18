import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'quote-selectable-option',
    imports: [CommonModule],
    templateUrl: './selectable-option.component.html',
    styleUrl: './selectable-option.component.scss'
})
export class SelectableOptionComponent {
  @Input()
  public selected?: boolean;

  @Input()
  public fullHeight?: boolean;

  @Input()
  public disabled?: boolean;

  @Output()
  public uiSelect: EventEmitter<void> = new EventEmitter<void>();
}
