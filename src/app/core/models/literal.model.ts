import { DataInfo } from '@shagui/ng-shagui/core';

export type LiteralType = 'value' | 'literal' | 'translate';
export type LiteralParam = DataInfo<LiteralModel>;
export type LiteralModel = string | number | QuoteLiteral;

export interface QuoteLiteral {
  value: string;
  params?: LiteralParam;
  type?: LiteralType;
}
