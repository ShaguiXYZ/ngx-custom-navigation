import { CommonModule } from '@angular/common';
import { ɵDeferBlockState } from '@angular/core';
import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxAvatarModule } from '@aposin/ng-aquila/avatar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { IIconData, NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralDirective } from '../../directives';
import { SelectableOptionComponent } from '../selectable-option';
import { IconCardComponent } from './icon-card.component';

describe('IconCardComponent', () => {
  const iconData: IIconData = { index: '1', data: 'icon' };
  let component: IconCardComponent;
  let fixture: ComponentFixture<IconCardComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [IconCardComponent, CommonModule, SelectableOptionComponent, NxAvatarModule, NxCopytextModule, QuoteLiteralDirective],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual
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

  it('should display label when showLabel is true', async () => {
    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

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

  /**
   * @howto How to Unit Test the Deferrable Views
   * ref: https://angular.love/learn-how-to-unit-test-the-deferrable-views
   */
  it('should apply selected class when selected is true', async () => {
    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

    component.selected = true;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.card-container'));
    expect(cardElement.classes['selected']).toBeTrue();
  });

  it('should not apply selected class when selected is false', async () => {
    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

    component.selected = false;
    fixture.detectChanges();

    const cardElement = fixture.debugElement.query(By.css('.card-container'));

    expect(cardElement.classes['.selected']).toBeUndefined();
  });
});
