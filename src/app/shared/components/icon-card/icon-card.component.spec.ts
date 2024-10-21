import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { QuoteLiteralDirective } from '../../directives';
import { IIconData } from '../../models';
import { SelectableOptionComponent } from '../selectable-option';
import { IconCardComponent } from './icon-card.component';

describe('IconCardComponent', () => {
  const iconData: IIconData = { index: '1', data: 'icon' };
  let component: IconCardComponent;
  let fixture: ComponentFixture<IconCardComponent>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IconCardComponent, CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule, QuoteLiteralDirective],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IconCardComponent);
    component = fixture.componentInstance;
    component.data = iconData;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiSelect event when selectIcon is called', () => {
    spyOn(component.uiSelect, 'emit');

    component.selectIcon();

    expect(component.uiSelect.emit).toHaveBeenCalledWith(iconData);
  });

  it('should display label when showLabel is true', () => {
    component.showLabel = true;
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.card-container span'));
    expect(labelElement).toBeTruthy();
  });

  it('should not display label when showLabel is false', () => {
    component.showLabel = false;
    fixture.detectChanges();

    const labelElement = fixture.debugElement.query(By.css('.card-container span'));
    expect(labelElement).toBeFalsy();
  });

  it('should apply selected class when selected is true', () => {
    component.selected = true;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.card-container'));
    expect(cardElement.classes['selected']).toBeTrue();
  });

  it('should not apply selected class when selected is false', () => {
    component.selected = false;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.card-container'));

    expect(cardElement.classes['.selected']).toBeUndefined();
  });
});
