import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectableOptionComponent } from './selectable-option.component';

describe('SelectableOptionComponent', () => {
  let component: SelectableOptionComponent;
  let fixture: ComponentFixture<SelectableOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableOptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
