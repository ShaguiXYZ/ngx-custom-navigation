import { DataInfo } from '@shagui/ng-shagui/core';

export type LiteralType = 'value' | 'translate';

export interface QuoteLiteral {
  value: string;
  type?: LiteralType;
}

export type LiteralParam = DataInfo<LiteralModel>;

export type LiteralModel = string | QuoteLiteral;
