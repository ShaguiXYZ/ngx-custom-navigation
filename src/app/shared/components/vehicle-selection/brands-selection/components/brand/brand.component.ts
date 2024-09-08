import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrandData, BrandKey, IVehicleDictionaryData } from '../../../models';

@Component({
  selector: 'quote-brand',
  standalone: true,
  imports: [CommonModule],
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
