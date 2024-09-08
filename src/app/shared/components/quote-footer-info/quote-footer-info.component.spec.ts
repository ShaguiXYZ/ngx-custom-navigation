import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteFooterInfoComponent } from './quote-footer-info.component';

describe('QuoteFooterInfoComponent', () => {
  let component: QuoteFooterInfoComponent;
  let fixture: ComponentFixture<QuoteFooterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteFooterInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteFooterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
