import { QUOTE_MASK, QuoteMaskType } from '../mask.model';

describe('QuoteMask', () => {
  const testCases: { type: QuoteMaskType; valid: string[]; invalid: string[] }[] = [
    {
      type: 'numeric',
      valid: ['123', '4567890', ''],
      invalid: ['abc', '123abc']
    },
    {
      type: 'alphanumeric',
      valid: ['abc123', 'ABC', '123', ''],
      invalid: ['abc@123', 'abc 123']
    },
    {
      type: 'mail',
      valid: ['test@example.com', 'user.name@domain.co'],
      invalid: ['invalid-email', 'user@domain', '']
    }
  ];

  testCases.forEach(({ type, valid, invalid }) => {
    describe(`${type} mask`, () => {
      const mask = QUOTE_MASK[type];

      valid.forEach(value => {
        it(`should validate "${value}" as valid`, () => {
          expect(mask.test(value)).toBe(true);
        });
      });

      invalid.forEach(value => {
        it(`should validate "${value}" as invalid`, () => {
          expect(mask.test(value)).toBe(false);
        });
      });
    });
  });

  it('should prevent edition for mail mask', () => {
    expect(QUOTE_MASK.mail.preventEdition()).toBe(false);
  });

  it('should allow edition for numeric and alphanumeric masks', () => {
    expect(QUOTE_MASK.numeric.preventEdition()).toBe(true);
    expect(QUOTE_MASK.alphanumeric.preventEdition()).toBe(true);
  });
});
