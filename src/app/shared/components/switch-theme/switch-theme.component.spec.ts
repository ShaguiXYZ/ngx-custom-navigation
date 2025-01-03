import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { of } from 'rxjs';
import { Theme } from './models';
import { ThemingService } from './services';
import { SwitchThemeComponent } from './switch-theme.component';

describe('SwitchThemeComponent', () => {
  let component: SwitchThemeComponent;
  let fixture: ComponentFixture<SwitchThemeComponent>;

  beforeEach(async () => {
    const themingServiceMock = {
      themeChange: of('light' as Theme),
      get theme() {
        return 'light' as Theme;
      },
      set theme(value: Theme) {
        // do nothing
      }
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [SwitchThemeComponent, NxSwitcherModule],
      providers: [{ provide: ThemingService, useValue: themingServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should switch theme from light to dark', () => {
    component.theme = 'light';
    component.switchTheme();
    expect(component.theme).toBe('dark');
  });

  it('should switch theme from dark to light', () => {
    component.theme = 'dark';
    component.switchTheme();
    expect(component.theme).toBe('light');
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = spyOn(component['subscription$'][0], 'unsubscribe');
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
