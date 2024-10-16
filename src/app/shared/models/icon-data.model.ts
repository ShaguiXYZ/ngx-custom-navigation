import { IndexedData } from 'src/app/core/models';

export interface IIconData<T = string, K extends string | number | symbol = string> extends IndexedData<T, K> {
  icon?: string;
}
