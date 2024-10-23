import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { SelectableOptionComponent } from '../selectable-option';

@Component({
  selector: 'quote-text-card',
  templateUrl: './text-card.component.html',
  styleUrl: './text-card.component.scss',
  standalone: true,
  imports: [CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule]
})
export class TextCardComponent {
  @Input()
  public selected?: boolean;

  @Input()
  public fullHeight = true;

  @Output()
  public uiSelect: EventEmitter<string | number | symbol> = new EventEmitter<string | number | symbol>();

  public _data!: string | number | symbol;

  public get data(): string | number | symbol {
    return this._data;
  }
  @Input()
  public set data(value: string | number | symbol) {
    this._data = value;
  }

  public selectText(): void {
    this.uiSelect.emit(this._data);
  }
}
