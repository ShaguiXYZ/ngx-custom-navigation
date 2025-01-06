import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SESSION_THEME_KEY, Theme } from '../models';
import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  let service: ThemingService;

  beforeEach(() => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [ThemingService, { provide: HttpClient, useValue: httpClientSpy }]
    });

    service = TestBed.inject(ThemingService);
  });

  afterEach(() => {
    localStorage.removeItem(SESSION_THEME_KEY);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with system theme if no theme is stored', () => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');

    service = TestBed.inject(ThemingService);

    expect(service.theme).toBe(darkThemeMq.matches ? 'dark' : 'light');
  });

  it('should initialize with stored theme if available', () => {
    const localStorageSpy = spyOn(localStorage, 'getItem');
    localStorageSpy.and.returnValue(JSON.stringify({ active: 'dark' }));

    const newService = TestBed.inject(ThemingService);

    expect(newService.theme).toBe('dark');
  });

  it('should change theme', () => {
    service.theme = 'dark';
    expect(service.theme).toBe('dark');
  });

  it('should emit themeChange when theme is changed', done => {
    service.themeChange.subscribe((theme: Theme) => {
      expect(theme).toBe('dark');
      done();
    });

    service.theme = 'dark';
  });

  it('should handle dark theme media query change', () => {
    const event = new MediaQueryListEvent('change', { matches: true });
    service['darkThemeMqListener'](event);
    expect(service.theme).toBe('dark');
    // expect(applicationRefSpy.tick).toHaveBeenCalled();
  });

  it('should remove event listener on destroy', () => {
    const removeEventListenerSpy = spyOn(service['darkThemeMq'], 'removeEventListener');
    service.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
