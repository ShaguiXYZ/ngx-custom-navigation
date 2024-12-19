import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CaptchaService } from 'src/app/core/services';
import { HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { CaptchaComponent } from './captcha.component';
import { ColorCaptchaComponent } from './components';
import { CAPTCHA_SUBMIT_KEY } from './constants';

describe('CaptchaComponent', () => {
  let component: CaptchaComponent;
  let fixture: ComponentFixture<CaptchaComponent>;
  let captchaServiceSpy: jasmine.SpyObj<CaptchaService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    captchaServiceSpy = jasmine.createSpyObj('CaptchaService', ['execute']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [CaptchaComponent, ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective],
      providers: [
        { provide: CaptchaService, useValue: captchaServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CaptchaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit uiVerified when onUiVerified is called with true', async () => {
    const token = 'test-token';
    captchaServiceSpy.execute.and.returnValue(Promise.resolve(token));
    spyOn(component.uiVerified, 'emit');

    await component.onUiVerified(true);

    expect(captchaServiceSpy.execute).toHaveBeenCalledWith({ action: CAPTCHA_SUBMIT_KEY });
    expect(component.uiVerified.emit).toHaveBeenCalledWith(true);
  });

  it('should emit uiVerified when onUiVerified is called with false', () => {
    spyOn(component.uiVerified, 'emit');

    component.onUiVerified(false);

    expect(captchaServiceSpy.execute).not.toHaveBeenCalled();
    expect(component.uiVerified.emit).toHaveBeenCalledWith(false);
  });

  it('should catch error and emit false when onUiVerified is called with true', async () => {
    const error = new Error('test-error');
    captchaServiceSpy.execute.and.returnValue(Promise.reject(error));
    spyOn(console, 'error');
    spyOn(component.uiVerified, 'emit');

    await component.onUiVerified(true);

    expect(captchaServiceSpy.execute).toHaveBeenCalledWith({ action: CAPTCHA_SUBMIT_KEY });
    expect(console.error).toHaveBeenCalledWith('Error executing captcha', error);
    expect(component.uiVerified.emit).toHaveBeenCalledWith(false);
  });
});
