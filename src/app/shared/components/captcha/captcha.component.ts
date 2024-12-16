import { Component, EventEmitter, Output } from '@angular/core';
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

  public onUiVerified(verified: boolean): void {
    this.uiVerified.emit(verified);
  }
}
