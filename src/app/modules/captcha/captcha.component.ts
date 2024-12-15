import { Component, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { ColorCaptchaComponent, HeaderTitleComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-captcha',
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss',
  standalone: true,
  imports: [ColorCaptchaComponent, HeaderTitleComponent, QuoteLiteralDirective]
})
export class CaptchaComponent {
  private readonly contextDataService = inject(ContextDataService);

  public onCaptchaVerified(verified: boolean): void {
    const appContextData = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    appContextData.navigation.flags = { ...appContextData.navigation.flags, captchaVerified: verified };
    this.contextDataService.set(QUOTE_APP_CONTEXT_DATA, appContextData);
  }
}
