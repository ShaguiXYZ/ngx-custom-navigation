import { TestBed } from '@angular/core/testing';
import { LiteralToStringPipe } from '../literal-to-string.pipe';
import { LiteralsService } from 'src/app/core/services';
import { LiteralModel } from 'src/app/core/models';

describe('LiteralToStringPipe', () => {
  let pipe: LiteralToStringPipe;
  let literalsService: jasmine.SpyObj<LiteralsService>;

  beforeEach(() => {
    const literalsServicespy = jasmine.createSpyObj('LiteralsService', ['toString']);

    TestBed.configureTestingModule({
      providers: [LiteralToStringPipe, { provide: LiteralsService, useValue: literalsServicespy }]
    });

    pipe = TestBed.inject(LiteralToStringPipe);
    literalsService = TestBed.inject(LiteralsService) as jasmine.SpyObj<LiteralsService>;
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform literal to string without params', () => {
    const literal: LiteralModel = { value: 'testValue', type: 'value' };
    literalsService.toString.and.returnValue('testValue');

    const result = pipe.transform(literal);

    expect(result).toBe('testValue');
    expect(literalsService.toString).toHaveBeenCalledWith(literal, undefined);
  });

  it('should transform literal to string with params', () => {
    const literal: LiteralModel = { value: 'testValue', type: 'value' };
    const params = { param1: 'value1' };
    literalsService.toString.and.returnValue('testValue with params');

    const result = pipe.transform(literal, params);

    expect(result).toBe('testValue with params');
    expect(literalsService.toString).toHaveBeenCalledWith(literal, params);
  });
});
