import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { IIconData } from '../../models';

@Component({
  selector: 'quote-icon-card',
  standalone: true,
  imports: [CommonModule, NxAvatarModule],
  templateUrl: './icon-card.component.html',
  styleUrl: './icon-card.component.scss'
})
export class IconCardComponent {
  @Input()
  public showLabel = true;

  @Input()
  public selected?: boolean;

  @Output()
  public uiSelect: EventEmitter<IIconData> = new EventEmitter<IIconData>();

  public _data!: IIconData;

  public get data(): IIconData {
    return this._data;
  }
  @Input()
  public set data(value: IIconData) {
    this._data = value;
  }

  public selectIcon(): void {
    this.uiSelect.emit(this._data);
  }
}
