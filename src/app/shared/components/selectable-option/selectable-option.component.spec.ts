import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectableOptionComponent } from './selectable-option.component';
import { By } from '@angular/platform-browser';

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

  it('should emit uiSelect event when selected', () => {
    spyOn(component.uiSelect, 'emit');

    component.selected = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.option__container'));
    element.triggerEventHandler('click', null);

    expect(component.uiSelect.emit).toHaveBeenCalled();
  });

  it('should have fullHeight class when fullHeight is true', () => {
    component.selected = true;
    component.fullHeight = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.option__checked'));
    expect(element.classes['full-height']).toBeTrue();
  });

  it('should have disabled class when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.option__container'));
    expect(element.classes['disabled']).toBeTrue();
  });

  it('should not emit uiSelect event when disabled', () => {
    spyOn(component.uiSelect, 'emit');

    component.disabled = true;
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.option__container'));
    element.triggerEventHandler('click', null);

    expect(component.uiSelect.emit).not.toHaveBeenCalled();
  });
});
