// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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
};
