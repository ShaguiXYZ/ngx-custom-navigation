import { Component } from '@angular/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteComponent } from 'src/app/core/models';
import { ColorCaptchaComponent, HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-captcha',
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
  standalone: true,
  imports: [ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective]
})
export class CaptchaComponent extends QuoteComponent {
  public onCaptchaVerified(verified: boolean): void {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    appContextData.navigation.flags = { ...appContextData.navigation.flags, captchaVerified: verified };
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, appContextData);
  }
}
