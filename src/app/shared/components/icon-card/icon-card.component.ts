import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { IIconData } from 'src/app/core/models';
import { QuoteLiteralDirective } from '../../directives';
import { SelectableOptionComponent } from '../selectable-option';

@Component({
  selector: 'quote-icon-card',
  templateUrl: './icon-card.component.html',
  styleUrl: './icon-card.component.scss',
  imports: [CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule, QuoteLiteralDirective],
  standalone: true
})
export class IconCardComponent {
  @Input()
  public showLabel = true;

  @Input()
  public selected?: boolean;

  @Output()
  public uiSelect: EventEmitter<IIconData> = new EventEmitter<IIconData>();

  private _data!: IIconData;

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
