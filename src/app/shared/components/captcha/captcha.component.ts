import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CAPTCHA_TOKEN_KEY } from 'src/app/core/constants';
import { CaptchaService } from 'src/app/core/services';
import { QuoteLiteralDirective } from '../../directives';
import { ColorCaptchaComponent } from '../color-captcha';
import { HeaderTitleComponent } from '../header-title';
import { CAPTCHA_SUBMIT_KEY } from './constants';

@Component({
  selector: 'quote-captcha',
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
  imports: [ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective],
  standalone: true
})
export class CaptchaComponent {
  @Output()
  public uiVerified: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly captchaService = inject(CaptchaService);

  public onUiVerified = async (isVerified: boolean): Promise<void> => {
    if (isVerified) {
      try {
        await this.captchaService.execute(CAPTCHA_SUBMIT_KEY);
        this.uiVerified.emit(true);
      } catch (error) {
        console.error('Error executing captcha', error);
        this.uiVerified.emit(false);
      }
    } else {
      this.uiVerified.emit(false);
    }
  };
}
