import { IndexedData } from '@shagui/ng-shagui/core';

export interface IIconData<T = string, K extends string | number | symbol = string> extends IndexedData<T, K> {
  icon?: string;
}
