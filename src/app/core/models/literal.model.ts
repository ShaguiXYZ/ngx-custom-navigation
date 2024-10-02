export type LiteralType = 'value' | 'translate';

export interface QuoteLiteral {
  value: string;
  type?: LiteralType;
}

export type LiteralModel = string | QuoteLiteral;
