import { QuoteLiteralPipe } from '../quote-literal.pipe';
import { LiteralsService } from 'src/app/core/services';
import { LiteralModel, LiteralParam } from 'src/app/core/models';
import { TestBed } from '@angular/core/testing';

describe('QuoteLiteralPipe', () => {
  let pipe: QuoteLiteralPipe;
  let literalsService: jasmine.SpyObj<LiteralsService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LiteralsService', ['toString']);

    TestBed.configureTestingModule({
      providers: [QuoteLiteralPipe, { provide: LiteralsService, useValue: spy }]
    });

    pipe = TestBed.inject(QuoteLiteralPipe);
    literalsService = TestBed.inject(LiteralsService) as jasmine.SpyObj<LiteralsService>;
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform string literal', () => {
    const literal: LiteralModel = 'testLiteral';
    const params: LiteralParam = { key: 'value' };
    literalsService.toString.and.returnValue('transformedLiteral');

    const result = pipe.transform(literal, params);

    expect(result).toBe('transformedLiteral');
    expect(literalsService.toString).toHaveBeenCalledWith({ value: 'testLiteral', params, type: 'literal' });
  });

  it('should transform object literal', () => {
    const literal: LiteralModel = { value: 'testLiteral' };
    const params: LiteralParam = { key: 'value' };
    literalsService.toString.and.returnValue('transformedLiteral');

    const result = pipe.transform(literal, params);

    expect(result).toBe('transformedLiteral');
    expect(literalsService.toString).toHaveBeenCalledWith(literal, params);
  });

  it('should transform without params', () => {
    const literal: LiteralModel = 'testLiteral';
    literalsService.toString.and.returnValue('transformedLiteral');

    const result = pipe.transform(literal);

    expect(result).toBe('transformedLiteral');
    expect(literalsService.toString).toHaveBeenCalledWith({ value: 'testLiteral', params: undefined, type: 'literal' });
  });
});
