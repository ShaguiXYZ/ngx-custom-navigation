import { CommonModule } from '@angular/common';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { SelectableOptionComponent } from '../selectable-option';
import { TextCardComponent } from './text-card.component';
import { ɵDeferBlockState } from '@angular/core';

describe('TextCardComponent', () => {
  let component: TextCardComponent;
  let fixture: ComponentFixture<TextCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [TextCardComponent, CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule],
      deferBlockBehavior: DeferBlockBehavior.Manual
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiSelect event with data when selectText is called', () => {
    spyOn(component.uiSelect, 'emit');
    component.data = 'Test Data';
    component.selectText();
    expect(component.uiSelect.emit).toHaveBeenCalledWith('Test Data');
  });

  it('should set and get data correctly', () => {
    component.data = 'Test Data';
    expect(component.data).toBe('Test Data');
  });

  it('should have fullHeight as true by default', () => {
    expect(component.fullHeight).toBeTrue();
  });

  it('should render the data in the template', async () => {
    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

    component.data = 'Rendered Data';
    fixture.detectChanges();

    const containerElement = fixture.debugElement.query(By.css('.card-container'));
    const textElement = containerElement.query(By.css('span'));

    expect(textElement.nativeElement.textContent).toContain('Rendered Data');
  });
});
