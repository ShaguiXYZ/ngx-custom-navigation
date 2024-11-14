import { DataInfo } from '@shagui/ng-shagui/core';
import { IIconData } from './icon-data.model';

export type IconDictionary = DataInfo<Partial<IIconData> & { icon: string }>;
