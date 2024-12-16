import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ColorCaptchaComponent, HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { CaptchaComponent } from './captcha.component';

describe('CaptchaComponent', () => {
  let component: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CaptchaComponent, ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective],
      providers: [{ provide: TranslateService, useValue: translateServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiVerified', () => {
    spyOn(component.uiVerified, 'emit');

    component.onUiVerified(true);

    expect(component.uiVerified.emit).toHaveBeenCalledWith(true);
  });
});
