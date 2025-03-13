import { ChangeDetectorRef, Component, DebugElement, RendererFactory2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QuoteAutoFocusDirective } from '../quote-auto-focus.directive';

@Component({
  template: `<input nxAutoFocus />`,
  imports: [QuoteAutoFocusDirective]
})
class TestComponent {}

describe('QuoteAutoFocusDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteAutoFocusDirective, TestComponent],
      providers: [{ provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }]
    });

    fixture = TestBed.createComponent(TestComponent);
    inputEl = fixture.debugElement.query(By.directive(QuoteAutoFocusDirective));
  });

  it('should create an instance', () => {
    const rendererFactory = TestBed.inject(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);
    const directive = new QuoteAutoFocusDirective(mockChangeDetectorRef, inputEl, renderer);
    expect(directive).toBeTruthy();
  });

  it('should set focus on the input element', async () => {
    fixture.detectChanges();
    spyOn(inputEl.nativeElement, 'focus').and.callThrough();

    await fixture.whenStable();
    expect(inputEl.nativeElement.focus).toHaveBeenCalled();
  });

  it('should set tabindex to 0 if not already set', async () => {
    fixture.detectChanges();

    await fixture.whenStable();
    expect(inputEl.nativeElement.getAttribute('tabindex')).toBe('0');
  });

  it('should not override existing tabindex', async () => {
    inputEl.nativeElement.setAttribute('tabindex', '1');
    fixture.detectChanges();
    fixture.whenStable();
    expect(inputEl.nativeElement.getAttribute('tabindex')).toBe('1');
  });
});
