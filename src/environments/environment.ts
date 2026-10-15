import type { EnvironmentConfig } from './environment.model';

export const environment = {
  production: false,
  loadingOnNav: true,
  appName: 'ngx-custom-navigation',
  baseUrl: 'http://localhost:3000',
  mockUrl: '', // url bff mock server
  domain: 'localhost:3000', // domain localhost
  recaptcha: {
    siteKey: ''
  },
  scripts: []
} satisfies EnvironmentConfig;
