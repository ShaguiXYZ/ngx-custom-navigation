import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuoteZoneComponent } from './quote-zone.component';

describe('QuoteZoneComponent', () => {
  let component: QuoteZoneComponent;
  let fixture: ComponentFixture<QuoteZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteZoneComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render content inside ng-content', () => {
    const compiled = fixture.nativeElement;
    const content = 'Test content';
    compiled.innerHTML = content;
    fixture.detectChanges();
    expect(compiled.innerHTML).toContain(content);
  });
});
