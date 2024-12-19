import { Inject, Injectable, InjectionToken } from '@angular/core';

export interface RecaptchaConfig {
  siteKey: string;
}

export const NX_RECAPTCHA_TOKEN = new InjectionToken<RecaptchaConfig>('NX_RECAPTCHA_TOKEN');

declare const grecaptcha: {
  enterprise: {
    ready: (callback: () => void) => void;
    execute: (siteKey: string, data: { action: string }) => Promise<string>;
  };
};

@Injectable({ providedIn: 'root' })
export class CaptchaService {
  constructor(@Inject(NX_RECAPTCHA_TOKEN) private readonly config: RecaptchaConfig) {
    this.headScript();
  }

  public execute = (data: { action: string }): Promise<string> => {
    return new Promise((resolve, reject) => {
      grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise
          .execute(this.config.siteKey, data)
          .then((token: string) => resolve(token))
          .catch((error: Error) => reject(error));
      });
    });
  };

  private headScript = (): void => {
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${this.config.siteKey}`;
    head.appendChild(script);
  };
}
