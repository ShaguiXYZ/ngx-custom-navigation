import { TestBed } from '@angular/core/testing';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Condition } from '../../models';
import { ConditionService } from '../condition.service';

describe('ConditionService', () => {
  let service: ConditionService;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ContextDataService', ['get']);

    TestBed.configureTestingModule({
      providers: [ConditionService, { provide: ContextDataService, useValue: spy }]
    });

    service = TestBed.inject(ConditionService);
    contextDataServiceSpy = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if no conditions are provided', () => {
    expect(service.checkConditions()).toBeTrue();
  });

  it('should evaluate conditions correctly', () => {
    const conditions: Condition[] = [
      { expression: 'quote.status', operation: '===', value: 'approved' },
      { expression: 'quote.amount', operation: '>', value: 1000, union: 'AND' }
    ];

    contextDataServiceSpy.get.and.returnValue({ quote: { status: 'approved', amount: 1500 } });

    expect(service.checkConditions(conditions)).toBeTrue();
  });

  it('should return false if any condition fails with AND union', () => {
    const conditions: Condition[] = [
      { expression: 'quote.status', operation: '===', value: 'approved' },
      { expression: 'quote.amount', operation: '>', value: 1000, union: 'AND' }
    ];

    contextDataServiceSpy.get.and.returnValue({ quote: { status: 'approved', amount: 500 } });

    expect(service.checkConditions(conditions)).toBeFalse();
  });

  it('should return true if any condition passes with OR union', () => {
    const conditions: Condition[] = [
      { expression: 'quote.status', operation: '===', value: 'approved' },
      { expression: 'quote.amount', operation: '>', value: 1000, union: 'OR' }
    ];

    contextDataServiceSpy.get.and.returnValue({ quote: { status: 'rejected', amount: 1500 } });

    expect(service.checkConditions(conditions)).toBeTrue();
  });

  it('should handle complex conditions with mixed unions', () => {
    const conditions: Condition[] = [
      { expression: 'quote.status', operation: '===', value: 'approved' },
      { expression: 'quote.amount', operation: '>', value: 1000, union: 'AND' },
      { expression: 'quote.type', operation: '===', value: 'special', union: 'OR' }
    ];

    contextDataServiceSpy.get.and.returnValue({ quote: { status: 'approved', amount: 500, type: 'special' } });

    expect(service.checkConditions(conditions)).toBeTrue();
  });

  it('should log an error if condition evaluation fails', () => {
    const conditions: Condition[] = [{ expression: 'quote.status', operation: 'xxx', value: 'approved' }];

    contextDataServiceSpy.get.and.returnValue({ quote: { status: 'approved' } });
    spyOn(console, 'group');
    spyOn(console, 'error');

    expect(service.checkConditions(conditions)).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  });
});
