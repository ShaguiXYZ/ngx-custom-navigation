import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { SelectableOptionComponent } from 'src/app/shared/components';
import { BrandData, BrandKey, IVehicleDictionaryData } from 'src/app/shared/models';

@Component({
  selector: 'quote-brand',
  standalone: true,
  imports: [CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule],
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent {
  @Input()
  public selected?: boolean;

  @Output()
  public uiSelect: EventEmitter<string> = new EventEmitter<string>();

  public data?: IVehicleDictionaryData;

  private _brand!: BrandKey;

  public get brand(): string {
    return this._brand as string;
  }
  @Input()
  public set brand(value: BrandKey) {
    this._brand = value;
    this.data = BrandData.value(this._brand);
  }

  public selectBrand(): void {
    this.uiSelect.emit(this.brand);
  }
}
