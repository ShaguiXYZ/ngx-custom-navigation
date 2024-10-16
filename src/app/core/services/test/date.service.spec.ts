import { TestBed } from '@angular/core/testing';
import { LOCALE_ID } from '@angular/core';
import { DateService } from '../date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService, { provide: LOCALE_ID, useValue: 'en-US' }]
    });
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toLocaleDateString', () => {
    it('should format date to locale string', () => {
      const date = new Date('2023-10-05');
      expect(service.toLocaleDateString(date)).toBe('10/05/2023');
    });

    it('should return null for invalid date', () => {
      expect(service.toLocaleDateString('invalid-date')).toBeNull();
    });

    it('should format string date to locale string', () => {
      expect(service.toLocaleDateString('2023-10-05')).toBe('10/05/2023');
    });
  });

  describe('toISODateString', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2023-10-05');
      expect(service.toISODateString(date)).toBe('2023-10-05');
    });

    it('should return null for invalid date', () => {
      expect(service.toISODateString('invalid-date')).toBeNull();
    });

    it('should format string date to ISO string', () => {
      expect(service.toISODateString('2023-10-05')).toBe('2023-10-05');
    });
  });

  describe('toISODateInteger', () => {
    it('should format date to ISO integer', () => {
      const date = new Date('2023-10-05');
      expect(service.toISODateInteger(date)).toBe(20231005);
    });

    it('should return 0 for invalid date', () => {
      expect(service.toISODateInteger('invalid-date')).toBe(0);
    });

    it('should format string date to ISO integer', () => {
      expect(service.toISODateInteger('2023-10-05')).toBe(20231005);
    });
  });
});
