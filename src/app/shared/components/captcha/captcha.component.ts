import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CaptchaService } from 'src/app/core/services';
import { QuoteLiteralDirective } from '../../directives';
import { ColorCaptchaComponent } from '../color-captcha';
import { HeaderTitleComponent } from '../header-title';

@Component({
  selector: 'quote-captcha',
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
  standalone: true,
  imports: [ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective]
})
export class CaptchaComponent {
  @Output()
  public uiVerified: EventEmitter<boolean> = new EventEmitter<boolean>();

  private readonly captchaService = inject(CaptchaService);

  public onUiVerified(verified: boolean): void {
    verified &&
      this.captchaService.execute('submit').then(() => {
        this.uiVerified.emit(verified);
      });
  }
}
