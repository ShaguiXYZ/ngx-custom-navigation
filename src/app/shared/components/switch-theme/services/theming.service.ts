import { ApplicationRef, inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageLib } from 'src/app/core/lib';
import { STORAGE_THEME_KEY, Theme } from '../models';

// @howto service to handle theme changes
@Injectable()
export class ThemingService implements OnDestroy {
  public readonly themeChange = new BehaviorSubject<Theme>('light');

  private _theme!: Theme;
  private readonly darkThemeMq: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly ref = inject(ApplicationRef);

  constructor() {
    const storedTheme = StorageLib.get(STORAGE_THEME_KEY, 'local');
    const systemPrefersDark = this.darkThemeMq.matches;

    this.theme = (storedTheme && JSON.parse(storedTheme)?.active) || (systemPrefersDark ? 'dark' : 'light');
    this.themeChange.next(this.theme);
    this.darkThemeMq.addEventListener('change', this.darkThemeMqListener.bind(this));
  }

  ngOnDestroy(): void {
    this.darkThemeMq.removeEventListener('change', this.darkThemeMqListener.bind(this));
  }

  public get theme(): Theme {
    return this._theme;
  }
  public set theme(value: Theme) {
    if (this._theme !== value) {
      this._theme = value;
      document.body.setAttribute('data-theme', value);
      this.themeChange.next(value);
    }
  }

  private darkThemeMqListener = (e: MediaQueryListEvent): void => {
    const storedTheme = StorageLib.get(STORAGE_THEME_KEY, 'local');

    if (storedTheme) return;

    this.theme = e.matches ? 'dark' : 'light';
    this.ref.tick();
  };
}
