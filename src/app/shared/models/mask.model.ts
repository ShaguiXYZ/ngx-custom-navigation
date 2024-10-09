import { DataInfo } from '@shagui/ng-shagui/core';

interface QuoteMaskRegex {
  regExp: RegExp;
  preventEdition?: boolean;
}

const QUOTE_MASK_REGEX = {
  numeric: { regExp: /^[0-9]*$/ },
  alphanumeric: { regExp: /^[a-zA-Z0-9]*$/ },
  mail: { regExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, preventEdition: false }
};

export type QuoteMaskType = keyof typeof QUOTE_MASK_REGEX;

class QuoteMask {
  private readonly mask: QuoteMaskRegex;

  public constructor(maskType: QuoteMaskType) {
    this.mask = QUOTE_MASK_REGEX[maskType];
  }

  public getRegex(): QuoteMaskRegex {
    return this.mask;
  }

  public test(value: string): boolean {
    return this.mask.regExp.test(value);
  }

  public exec(value: string): RegExpExecArray | null {
    return this.mask.regExp.exec(value);
  }

  public match(value: string): RegExpMatchArray | null {
    return value.match(this.mask.regExp);
  }

  public preventEdition(): boolean {
    return this.mask.preventEdition !== false;
  }
}

export const QUOTE_MASK: DataInfo<QuoteMask, QuoteMaskType> = {
  numeric: new QuoteMask('numeric'),
  alphanumeric: new QuoteMask('alphanumeric'),
  mail: new QuoteMask('mail')
};
