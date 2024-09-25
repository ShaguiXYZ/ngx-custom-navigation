import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxIconModule } from '@aposin/ng-aquila/icon';

@Component({
  selector: 'quote-selectable-option',
  standalone: true,
  imports: [CommonModule, NxIconModule],
  templateUrl: './selectable-option.component.html',
  styleUrl: './selectable-option.component.scss'
})
export class SelectableOptionComponent {
  @Input()
  public selected?: boolean;

  @Input()
  public fullHeight?: boolean;

  @Output()
  public uiSelect: EventEmitter<void> = new EventEmitter<void>();
}
