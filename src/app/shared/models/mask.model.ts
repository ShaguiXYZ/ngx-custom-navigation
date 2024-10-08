import { DataInfo } from '@shagui/ng-shagui/core';

const QUOTE_MASK_REGEX = {
  numeric: /^[0-9]*$/,
  alphanumeric: /^[a-zA-Z0-9]*$/,
  mail: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
};

export type QuoteMaskType = keyof typeof QUOTE_MASK_REGEX;

class QuoteMask {
  private readonly mask: RegExp;

  public constructor(maskType: QuoteMaskType) {
    this.mask = QUOTE_MASK_REGEX[maskType];
  }

  public getRegex(): RegExp {
    return this.mask;
  }

  public test(value: string): boolean {
    return this.mask.test(value);
  }

  public exec(value: string): RegExpExecArray | null {
    return this.mask.exec(value);
  }

  public match(value: string): RegExpMatchArray | null {
    return value.match(this.mask);
  }
}

export const QUOTE_MASK: DataInfo<QuoteMask, QuoteMaskType> = {
  numeric: new QuoteMask('numeric'),
  alphanumeric: new QuoteMask('alphanumeric'),
  mail: new QuoteMask('mail')
};
