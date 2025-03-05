import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { SelectableOptionComponent } from './selectable-option.component';
import { By } from '@angular/platform-browser';
import { ɵDeferBlockState } from '@angular/core';

describe('SelectableOptionComponent', () => {
  let component: SelectableOptionComponent;
  let fixture: ComponentFixture<SelectableOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectableOptionComponent],
      deferBlockBehavior: DeferBlockBehavior.Manual
    }).compileComponents();

    fixture = TestBed.createComponent(SelectableOptionComponent);
    component = fixture.componentInstance;

    // @howto Set the first defer block to complete to render the component
    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiSelect event when selected', async () => {
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
