import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { QuoteFooterInfoComponent } from './quote-footer-info.component';

describe('QuoteFooterInfoComponent', () => {
  let component: QuoteFooterInfoComponent;
  let fixture: ComponentFixture<QuoteFooterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteFooterInfoComponent, CommonModule, NxCopytextModule, NxMessageModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteFooterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the icon when input is provided', () => {
    component.icon = 'test-icon';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('.quote__info__message__icon')); // Adjust the selector based on your template
    expect(iconElement).toBeTruthy();
  });

  it('should not display the icon when input is not provided', () => {
    component.icon = undefined;
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('.icon-class')); // Adjust the selector based on your template
    expect(iconElement).toBeNull();
  });
});
