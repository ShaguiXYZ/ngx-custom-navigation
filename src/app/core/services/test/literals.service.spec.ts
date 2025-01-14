/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NX_LANGUAGE_CONFIG, QuoteLiteral } from '../../models';
import { LiteralsService } from '../literals.service';

describe('LiteralsService', () => {
  let service: LiteralsService;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    TestBed.configureTestingModule({
      providers: [
        LiteralsService,
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    });

    service = TestBed.inject(LiteralsService);
    translateService = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty string if literal is null or undefined', () => {
    expect(service.toString(undefined)).toBe('');
  });

  it('should return the literal if it is a string', () => {
    const literal = 'Hello, World!';
    expect(service.toString(literal)).toBe(literal);
  });

  it('should replace parameters in the string literal', () => {
    const literal = 'Hello, {{name}}!';
    const params = { name: 'John' };
    expect(service.toString(literal, params)).toBe('Hello, John!');
  });

  it('should return the translated value if literal is a QuoteLiteral with type "translate"', () => {
    const literal: QuoteLiteral = { type: 'translate', value: 'HELLO' };
    const params = { name: 'John' };
    translateService.instant.and.returnValue('Hello, John!');
    expect(service.toString(literal, params)).toBe('Hello, John!');
    expect(translateService.instant).toHaveBeenCalledWith('HELLO', params);
  });

  it('should return the value if literal is a QuoteLiteral with type other than "translate"', () => {
    const literal: QuoteLiteral = { type: 'value', value: 'Hello, {{name}}!' };
    const params = { name: 'John' };
    expect(service.toString(literal, params)).toBe('Hello, John!');
  });

  it('should return the literal if it is an object but not a QuoteLiteral', () => {
    const literal: any = { some: 'object' };
    expect(service.toString(literal)).toBe('');
  });
});
