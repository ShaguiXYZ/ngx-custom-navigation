/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { LiteralsService } from 'src/app/core/services';
import { QuoteLiteralDirective } from '../quote-literal.directive';

@Component({
  template: `<div [nxQuoteLiteral]="literal" [nxQuoteLitealParams]="params" [nxQuoteDefaultLiteral]="defaultLiteral">safeHtml</div>`
})
class TestComponent {
  literal = 'testLiteral';
  params = { key: 'value' };
  defaultLiteral = 'defaultLiteral';
}

describe('QuoteLiteralDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;
  let literalsService: jasmine.SpyObj<LiteralsService>;
  let domSanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    const languageSubject = new Subject<any>();
    literalsService = jasmine.createSpyObj('LiteralsService', ['transformLiteral', 'onLanguageChange']);
    domSanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml', 'sanitize']);

    literalsService.onLanguageChange.and.returnValue(languageSubject.asObservable());

    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [QuoteLiteralDirective],
      providers: [
        { provide: LiteralsService, useValue: literalsService },
        { provide: DomSanitizer, useValue: domSanitizer }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement.querySelector('div') as HTMLElement;
  });

  it('should create an instance', () => {
    const directive = new QuoteLiteralDirective(literalsService, new ElementRef(element), domSanitizer);
    expect(directive).toBeTruthy();
  });

  it('should update element innerHTML with transformed literal', () => {
    literalsService.transformLiteral.and.returnValue('transformedLiteral');
    domSanitizer.sanitize.and.returnValue('sanitizedHtml');

    fixture.detectChanges();

    expect(element.innerHTML).toBe('sanitizedHtml');
    expect(literalsService.transformLiteral).toHaveBeenCalledWith('testLiteral', { key: 'value' });
    expect(domSanitizer.sanitize).toHaveBeenCalledWith(1, 'transformedLiteral');
  });

  it('should update element innerHTML with default literal if transformed literal is empty', () => {
    literalsService.transformLiteral.and.returnValue('');
    domSanitizer.sanitize.and.returnValue('sanitizedHtml');

    fixture.detectChanges();

    expect(element.innerHTML).toBe('sanitizedHtml');
    expect(literalsService.transformLiteral).toHaveBeenCalledWith('testLiteral', { key: 'value' });
    expect(domSanitizer.sanitize).toHaveBeenCalledWith(1, 'defaultLiteral');
  });

  it('should update element innerHTML with source literal if both transformed and default literals are empty', () => {
    literalsService.transformLiteral.and.returnValue('');
    domSanitizer.sanitize.and.returnValue('sanitizedHtml');

    component.defaultLiteral = '';
    fixture.detectChanges();

    expect(element.innerHTML).toBe('sanitizedHtml');
    expect(literalsService.transformLiteral).toHaveBeenCalledWith('testLiteral', { key: 'value' });
    expect(domSanitizer.sanitize).toHaveBeenCalledWith(1, 'safeHtml');
  });
});
