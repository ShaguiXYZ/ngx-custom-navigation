import { isNIE, isNIF } from './client-identification-number.model';

describe('Client Identification Number Model', () => {
  describe('isNIF', () => {
    it('should return true for a valid NIF', () => {
      expect(isNIF('12345678Z')).toBe(true);
    });

    it('should return false for an invalid NIF', () => {
      expect(isNIF('12345678A')).toBe(false);
    });

    it('should return false for an empty NIF', () => {
      expect(isNIF('')).toBe(false);
    });

    it('should return false for undefined NIF', () => {
      expect(isNIF(undefined)).toBe(false);
    });
  });

  describe('isNIE', () => {
    it('should return true for a valid NIE', () => {
      expect(isNIE('X1234567L')).toBe(true);
    });

    it('should return false for an invalid NIE', () => {
      expect(isNIE('X1234567A')).toBe(false);
    });

    it('should return false for an empty NIE', () => {
      expect(isNIE('')).toBe(false);
    });

    it('should return false for undefined NIE', () => {
      expect(isNIE(undefined)).toBe(false);
    });
  });
});
