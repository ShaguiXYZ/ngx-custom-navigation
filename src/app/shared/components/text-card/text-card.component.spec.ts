import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextCardComponent } from './text-card.component';

describe('TextCardComponent', () => {
  let component: TextCardComponent;
  let fixture: ComponentFixture<TextCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TextCardComponent);
    component = fixture.componentInstance;
    component.data = 'label';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
