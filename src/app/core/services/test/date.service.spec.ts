import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DateService } from '../date.service';

describe('DateService', () => {
  let dateService: DateService;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [provideHttpClientTesting()],
      providers: [DateService]
    })
  );
  beforeEach(() => {
    dateService = TestBed.inject(DateService);
  });

  it('should create service', () => {
    expect(dateService).toBeTruthy();
  });

  it('should return a locale-dependent string', () => {
    const date = new Date('2020-12-31');
    const result = dateService.toLocaleDateString(date);
    expect(result).toBe('12/31/2020');
  });

  it('should return a ISO string', () => {
    const date = new Date('2020-12-31');
    const result = dateService.toISODateString(date);
    expect(result).toBe('2020-12-31');
  });

  it('should return a ISO integer', () => {
    const date = new Date('2020-12-31');
    const result = dateService.toISODateInteger(date);
    expect(result).toBe(20201231);
  });
});
