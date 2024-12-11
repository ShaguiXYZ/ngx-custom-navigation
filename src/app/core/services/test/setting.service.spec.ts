import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { Configuration, QuoteSettingsModel } from '../../models';
import { JourneyService } from '../journey.service';
import { SettingsService } from '../setting.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpServiceSpy: jasmine.SpyObj<HttpService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;
  let journeyServiceSpy: jasmine.SpyObj<JourneyService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpService', ['get']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
    const contextSpy = jasmine.createSpyObj('ContextDataService', ['set', 'get']);
    const journeySpy = jasmine.createSpyObj('JourneyService', ['fetchConfiguration']);

    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: HttpService, useValue: httpSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: ContextDataService, useValue: contextSpy },
        { provide: JourneyService, useValue: journeySpy }
      ]
    });

    service = TestBed.inject(SettingsService);
    httpServiceSpy = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    contextDataServiceSpy = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    journeyServiceSpy = TestBed.inject(JourneyService) as jasmine.SpyObj<JourneyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings and set default language', async () => {
    const settings: QuoteSettingsModel = { commercialExceptions: { enableWorkFlow: true } } as QuoteSettingsModel;
    httpServiceSpy.get.and.returnValue(of(settings));
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ configuration: { homePageId: 'page', pageMap: { page: { pageId: 'id' } } } as unknown as Configuration })
    );

    await service.loadSettings();

    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('es-ES');
  });

  it('should disable workflow if commercialExceptions.enableWorkFlow is false', async () => {
    const settings: QuoteSettingsModel = { commercialExceptions: { enableWorkFlow: false } } as QuoteSettingsModel;
    httpServiceSpy.get.and.returnValue(of(settings));
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ configuration: { homePageId: 'page', pageMap: { page: { pageId: 'id' } } } as unknown as Configuration })
    );

    await service.loadSettings();

    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });

  it('should load context if commercialExceptions.enableWorkFlow is true', async () => {
    const settings: QuoteSettingsModel = { commercialExceptions: { enableWorkFlow: true } } as QuoteSettingsModel;
    httpServiceSpy.get.and.returnValue(of(settings));
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ configuration: { homePageId: 'page', pageMap: { page: { pageId: 'id' } } } as unknown as Configuration })
    );

    await service.loadSettings();

    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });
});
