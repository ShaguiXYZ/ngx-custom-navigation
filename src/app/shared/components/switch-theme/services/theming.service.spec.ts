import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { STORAGE_THEME_KEY, Theme } from '../models';
import { ThemingService } from './theming.service';

describe('ThemingService', () => {
  beforeEach(() => {
    const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [ThemingService, { provide: HttpClient, useValue: httpClientSpy }]
    });
  });

  afterEach(() => {
    localStorage.removeItem(STORAGE_THEME_KEY);
  });

  it('should be created', () => {
    const service = TestBed.inject(ThemingService);
    expect(service).toBeTruthy();
  });

  it('should initialize with system theme if no theme is stored', () => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    const service = TestBed.inject(ThemingService);

    expect(service.theme).toBe(darkThemeMq.matches ? 'dark' : 'light');
  });

  it('should initialize with stored theme if available', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ active: 'dark' }));
    const service = TestBed.inject(ThemingService);

    expect(service.theme).toBe('dark');
  });

  it('should change theme', () => {
    const service = TestBed.inject(ThemingService);
    service.theme = 'dark';
    expect(service.theme).toBe('dark');
  });

  it('should emit themeChange when theme is changed', done => {
    const service = TestBed.inject(ThemingService);

    service.themeChange.subscribe((theme: Theme) => {
      expect(theme).toBe('dark');
      done();
    });

    service.theme = 'dark';
  });

  it('should handle dark theme media query change', () => {
    const service = TestBed.inject(ThemingService);
    const event = new MediaQueryListEvent('change', { matches: true });

    service['darkThemeMqListener'](event);

    expect(service.theme).toBe('dark');
  });

  it('should remove event listener on destroy', () => {
    const service = TestBed.inject(ThemingService);
    const removeEventListenerSpy = spyOn(service['darkThemeMq'], 'removeEventListener');

    service.ngOnDestroy();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('change', service['darkThemeMqListener']);
  });
});
