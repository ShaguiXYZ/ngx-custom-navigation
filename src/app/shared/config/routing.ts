import { RouteConfig } from '@shagui/ng-shagui/core';

export enum AppUrls {
  _dispatcher = 'dispatcher',
  _loader = 'workflow-loader',
  _stored = 'stored',
  home = 'home',
  root = '**'
}

export const urls: RouteConfig = {
  [AppUrls._dispatcher]: { resetContext: true },
  [AppUrls._loader]: { resetContext: true },
  [AppUrls._stored]: { resetContext: true }
};
