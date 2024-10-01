export type LiteralType = 'value' | 'traslated';

export interface QuoteLiteral {
  value: string;
  type?: LiteralType;
}

export type LiteralModel = string | QuoteLiteral;
