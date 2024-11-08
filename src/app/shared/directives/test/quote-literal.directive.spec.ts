/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DebugElement, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable, of } from 'rxjs';
import { AppContextData } from 'src/app/core/models';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteLiteralDirective } from '../quote-literal.directive';

@Component({
  template: `<div
    [nxQuoteLiteral]="quote"
    [uiQuoteLitealParams]="params"
    [uiQuoteDefaultLiteral]="defaultLiteral"
    [uiAttribute]="attribute"
    [uiProperty]="property"
  ></div>`,
  standalone: true,
  imports: [QuoteLiteralDirective]
})
class TestComponent {
  quote = 'testQuote';
  params = {};
  defaultLiteral?: string;
  attribute?: string;
  property?: string;
}

describe('QuoteLiteralDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let debugElement: DebugElement;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'onDataChange']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const rederer2Spy = jasmine.createSpyObj('Renderer2', ['setAttribute', 'setProperty']);
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustHtml', 'sanitize']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteLiteralDirective, TestComponent],
      providers: [
        QuoteLiteralPipe,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: Renderer2, useValue: rederer2Spy },
        { provide: DomSanitizer, useValue: domSanitizerSpy }
      ]
    });

    contextDataServiceSpy.onDataChange.and.callFake((): Observable<any> => {
      return of({ navigation: {}, configuration: { literals: { testQuote: 'testQuote', type: 'value' } } } as unknown as AppContextData);
    });

    domSanitizerSpy.sanitize.and.callFake((context: any, value: any) => value);
    domSanitizerSpy.bypassSecurityTrustHtml.and.callFake((value: any) => value);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(QuoteLiteralDirective));

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    contextDataService.get.and.returnValue({
      navigation: {},
      configuration: { literals: { testQuote: 'testQuote', type: 'value' } }
    } as unknown as AppContextData);
  });

  it('should create an instance', () => {
    const directive = new QuoteLiteralDirective(
      debugElement,
      TestBed.inject(Renderer2),
      TestBed.inject(QuoteLiteralPipe),
      TestBed.inject(DomSanitizer)
    );

    expect(directive).toBeTruthy();
  });

  it('should set attribute when uiAttribute is provided', () => {
    component.attribute = 'title';
    fixture.detectChanges();

    expect(debugElement.nativeElement.getAttribute('title')).toBe('testQuote');
  });

  it('should set innerText when uiProperty is innerText', () => {
    component.property = 'innerText';
    fixture.detectChanges();

    expect(debugElement.nativeElement.innerText).toContain('testQuote');
  });

  it('should set innerHTML when uiProperty is innerHTML', () => {
    component.property = 'innerHTML';
    fixture.detectChanges();

    expect(debugElement.nativeElement.innerHTML).toContain('testQuote');
  });

  it('should use default literal when quote is not provided', () => {
    component.quote = '';
    component.defaultLiteral = 'defaultLiteral';
    component.property = 'innerText';
    fixture.detectChanges();

    expect(debugElement.nativeElement.innerText).toContain('defaultLiteral');
  });

  it('should update element after view init', () => {
    spyOn(debugElement.injector.get(QuoteLiteralDirective as any), 'updateElement');
    fixture.detectChanges();

    expect(debugElement.injector.get(QuoteLiteralDirective)['updateElement']).toHaveBeenCalled();
  });
});
