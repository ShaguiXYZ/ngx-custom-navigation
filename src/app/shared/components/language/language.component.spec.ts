/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from 'src/app/core/services';
import { LanguageComponent } from './language.component';

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;
  let languageServiceMock: any;

  beforeEach(async () => {
    languageServiceMock = {
      languages: { 'en-GB': { value: 'English' }, 'es-ES': { value: 'Spanish' } },
      current: 'en-GB',
      i18n: jasmine.createSpy('i18n').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LanguageComponent],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize languages and currentLanguage on ngOnInit', async () => {
    await component.ngOnInit();
    expect(component.languages).toEqual(['en-GB', 'es-ES']);
    expect(component.currentLanguage).toBe('en-GB');
  });

  it('should change language and emit uiChange event', async () => {
    spyOn(component.uiChange, 'emit');
    const newLang = 'es-ES';
    await component.changeLanguage(newLang);
    expect(component.currentLanguage).toBe(newLang);
    expect(languageServiceMock.i18n).toHaveBeenCalledWith(newLang);
    expect(component.uiChange.emit).toHaveBeenCalledWith(newLang);
  });

  it('should return the correct language name', () => {
    const langName = component.getLanguageName('es-ES');
    expect(langName).toEqual({ value: 'Spanish' });
  });
});
