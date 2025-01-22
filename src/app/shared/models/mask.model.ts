import { DataInfo } from '@shagui/ng-shagui/core';

interface QuoteMaskRegex {
  regExp: RegExp;
  preventEdition?: boolean;
}

const QUOTE_MASK_REGEX = {
  numeric: { regExp: /^[0-9]*$/ },
  character: { regExp: /^[a-zA-Z\s]*$/ },
  alphanumeric: { regExp: /^[a-zA-Z0-9\s]*$/ },
  mail: { regExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, preventEdition: false }
};

export type QuoteMaskType = keyof typeof QUOTE_MASK_REGEX;

class QuoteMask {
  private readonly mask: QuoteMaskRegex;

  public constructor(maskType: QuoteMaskType) {
    this.mask = QUOTE_MASK_REGEX[maskType];
  }

  public test(value: string): boolean {
    return this.mask.regExp.test(value);
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
  character: new QuoteMask('character'),
  mail: new QuoteMask('mail')
};
