import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QuoteMaskType } from '../../models';
import { QuoteMaskDirective } from '../quote-mask.directive';

@Component({
  template: `<input type="text" [nxQuoteMask]="mask" (uiValueMatch)="onValueMatch($event)" />`,
  standalone: true,
  imports: [QuoteMaskDirective]
})
class TestComponent {
  public mask: QuoteMaskType = 'numeric';
  public valueMatch = false;

  onValueMatch(match: boolean) {
    this.valueMatch = match;
  }
}

describe('QuoteMaskDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [TestComponent, QuoteMaskDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should create an instance', () => {
    const directive = new QuoteMaskDirective(new ElementRef(inputEl));

    expect(directive).toBeTruthy();
  });

  it('should allow special keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    inputEl.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('should emit uiValueMatch event on valid input', () => {
    component.mask = 'alphanumeric';
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: 'a' });
    inputEl.value = 'test';

    spyOn(component, 'onValueMatch');

    inputEl.dispatchEvent(event);
    expect(component.onValueMatch).toHaveBeenCalledWith(true);
  });

  it('should prevent input on invalid value', () => {
    component.mask = 'numeric';
    fixture.detectChanges();

    const event = new KeyboardEvent('keydown', { key: '!' });
    inputEl.value = 'invalid';
    spyOn(event, 'preventDefault');

    inputEl.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
