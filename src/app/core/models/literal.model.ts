import { DataInfo } from '@shagui/ng-shagui/core';
import { Condition } from './_configuration.model';

export type LiteralType = 'value' | 'literal' | 'data' | 'translate';
export type LiteralParam = DataInfo<LiteralModel>;
export type LiteralModel = string | number | QuoteLiteral;

export interface QuoteLiteral {
  value: string;
  params?: LiteralParam;
  type?: LiteralType;
  conditions?: Condition[];
}
