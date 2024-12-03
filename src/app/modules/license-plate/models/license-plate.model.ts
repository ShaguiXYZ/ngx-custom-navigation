export type CountryCodes = 'D' | 'E' | 'F' | 'PT' | 'UK';

export interface LicensePlateConfig {
  patterns: (string | RegExp)[];
  mask: string;
}

export const PatternsByCountry: Record<CountryCodes, LicensePlateConfig> = {
  D: { patterns: ['^[A-Z]{2}[ -]?[0-9]{5}$'], mask: 'AA-00000' },
  E: {
    patterns: ['^[0-9]{4}[ -]?[A-Z]{3}$', '^[A-Z]{1,2}[ -]?[0-9]{4}[ -]?[A-Z]{2}$', '^[A-Z]{2}[ -]?[0-9]{5}$'],
    mask: '0000-ZZZ / S-0000-ZZ / SS-00000'
  },
  F: { patterns: ['^[A-Z]{1,2}[ -]?[0-9]{4}[ -]?[A-Z]{2}$'], mask: 'AA-000-AA' },
  PT: { patterns: ['^[0-9]{2}[ -]?[0-9]{2}[ -]?[A-Z]{2}$'], mask: '00-00-AA' },
  UK: { patterns: ['^[A-Z]{2}[ -]?[0-9]{2}[ -]?[A-Z]{3}$'], mask: 'AA-00-AAA' }
};
