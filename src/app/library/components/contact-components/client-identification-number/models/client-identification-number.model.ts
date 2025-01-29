export interface PersonalDocumentConfig {
  pattern: string | RegExp;
  mask: string;
}

export const Patterns: Record<string, PersonalDocumentConfig> = {
  NIF: { pattern: '^[0-9]{8}[A-Z]$', mask: '00000000A' },
  NIE: { pattern: '^[XYZ][0-9]{7}[A-Z]$', mask: 'X0000000A' },
  CIF: { pattern: '^[A-Z]{1}[0-9]{7}[A-Z]$', mask: 'A0000000A' },
  NIE_OLD: { pattern: '^[XYZ][0-9]{7}[A-Z]$', mask: 'X0000000A' },
  NIF_OLD: { pattern: '^[0-9]{8}[A-Z]$', mask: '00000000A' }
};

export const isNIF = (nif?: string): boolean => {
  if (!nif) {
    return false;
  }

  const dni = nif.substring(0, 8);
  const letter = nif.charAt(8);
  const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const letterIndex = Number(dni) % 23;

  return letter.toUpperCase() === validLetters.charAt(letterIndex);
};

export const isNIE = (nie?: string): boolean => {
  if (!nie) {
    return false;
  }

  const nieLetter = nie.charAt(0);
  const nieNumber = nie.substring(1, 8);
  const nieLetterIndex = 'XYZ'.indexOf(nieLetter);
  if (nieLetterIndex === -1) {
    return false;
  }

  // Convert the initial letter to its corresponding number
  const convertedNieNumber = nieLetterIndex.toString() + nieNumber;
  const letter = nie.charAt(8);
  const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const letterIndex = Number(convertedNieNumber) % 23;

  return letter.toUpperCase() === validLetters.charAt(letterIndex);
};
