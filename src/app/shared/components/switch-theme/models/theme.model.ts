import { APP_NAME } from 'src/app/core/constants';

export const SESSION_THEME_KEY = `${APP_NAME.toUpperCase()}_ACTIVE_THEME`;
export type Theme = 'dark' | 'light';

export interface SessionTheme {
  active: Theme;
}
