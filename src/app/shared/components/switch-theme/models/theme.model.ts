export const STORAGE_THEME_KEY = `ACTIVE_THEME`;
export type Theme = 'dark' | 'light';

export interface SessionTheme {
  active: Theme;
}
