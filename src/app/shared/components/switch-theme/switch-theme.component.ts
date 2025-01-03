import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { Subscription } from 'rxjs';
import { SESSION_THEME_KEY, Theme } from './models';
import { ThemingService } from './services';

@Component({
  selector: 'nx-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.scss'],
  imports: [NxSwitcherModule],
  providers: [ThemingService],
  standalone: true
})
export class SwitchThemeComponent implements OnInit, OnDestroy {
  private readonly subscription$: Subscription[] = [];
  private readonly temingService = inject(ThemingService);

  ngOnInit(): void {
    this.subscription$.push(this.temingService.themeChange.subscribe((theme: Theme) => (this.theme = theme)));
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  public get theme(): Theme {
    return this.temingService.theme;
  }
  @Input()
  public set theme(value: Theme) {
    this.temingService.theme = value;
  }

  public switchTheme(): void {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(SESSION_THEME_KEY, JSON.stringify({ active: this.theme }));
  }
}
