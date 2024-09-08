/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-redeclare */
import { IndexdData } from '@shagui/ng-shagui/core';
import { FuelTypes, IIconData, VehicleData } from 'src/app/shared/models';
import { BrandKey, brandDictionary } from './brand-dictionary';

export const MAX_ICON_BRANDS = 12;
export const MAX_BUTTON_MODELS = 10;

export type FuelModel = IndexdData<string, FuelTypes>;
export type PowerRangesModel = IndexdData;

export interface IVehicleModel extends Partial<VehicleData> {
  // @override
  make: string;
  powerRange?: PowerRangesModel;
  yearOfManufacture?: number;
  vehicleTtype?: string;
}

export namespace IVehicleModel {
  export const init = (): IVehicleModel =>
    ({
      make: ''
    } as IVehicleModel);
}

export interface IVehicleDictionaryData extends Partial<IIconData> {}

export class BrandData {
  private static iconType = 'png';
  private static iconPath = 'assets/images/wm/insurances/car/brands/desktop';

  public static readonly value = (key: BrandKey): IVehicleDictionaryData => ({
    ...brandDictionary[key],
    icon: this.brandIcon(key)
  });

  public static readonly allBrands = (): string[] => Object.keys(brandDictionary).sort((a, b) => a.localeCompare(b));
  public static readonly iconBrands = (): string[] =>
    this.allBrands()
      .filter(key => brandDictionary[key].icon)
      .slice(0, MAX_ICON_BRANDS);

  private static brandIcon(key: BrandKey): string | undefined {
    const icon = brandDictionary[key]?.icon;
    return icon && `${this.iconPath}/${icon}.${this.iconType}`;
  }
}
