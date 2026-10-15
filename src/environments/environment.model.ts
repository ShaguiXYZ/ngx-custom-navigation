export interface EnvironmentConfig {
  production: boolean;
  loadingOnNav: boolean;
  appName: string;
  baseUrl: string;
  mockUrl: string;
  domain: string;
  recaptcha: {
    siteKey: string;
  };
  scripts: string[];
}
