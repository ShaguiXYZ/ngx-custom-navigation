/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { NX_RECAPTCHA_TOKEN, CaptchaService, RecaptchaConfig } from '../recaptcha.service';

declare const grecaptcha: any;

describe('CaptchaService', () => {
  let service: CaptchaService;
  const mockSiteKey = 'mock-site-key';
  const mockConfig: RecaptchaConfig = { siteKey: mockSiteKey };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaptchaService, { provide: NX_RECAPTCHA_TOKEN, useValue: mockConfig }]
    });
    service = TestBed.inject(CaptchaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should append script to head on initialization', () => {
    const head = document.getElementsByTagName('head')[0];
    const script = head.querySelector(`script[src="https://www.google.com/recaptcha/enterprise.js?render=${mockSiteKey}"]`);
    expect(script).toBeTruthy();
  });

  it('should execute recaptcha and return token', async () => {
    const mockToken = 'mock-token';
    grecaptcha.enterprise = {
      ready: (callback: () => void) => callback(),
      execute: () => Promise.resolve(mockToken)
    };

    const token = await service.execute({ action: 'test-action' });
    expect(token).toBe(mockToken);
  });

  it('should handle recaptcha execution error', async () => {
    const mockError = 'mock-error';
    grecaptcha.enterprise = {
      ready: (callback: () => void) => callback(),
      execute: () => Promise.reject(mockError)
    };

    try {
      await service.execute({ action: 'test-action' });
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
