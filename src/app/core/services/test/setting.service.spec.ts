/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_WORKFLOW_TOKEN } from '../../components/constants';
import { CommercialExceptionsModel, Configuration, JourneyInfo, QuoteSettingsModel } from '../../models';
import { JourneyService, QUOTE_JOURNEY_DISALED } from '../journey.service';
import { SettingsService } from '../setting.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;
  let journeyServiceSpy: jasmine.SpyObj<JourneyService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
    const contextSpy = jasmine.createSpyObj('ContextDataService', ['set', 'get']);
    const journeySpy = jasmine.createSpyObj('JourneyService', [
      'clientJourney',
      'fetchConfiguration',
      'hasBreakingChange',
      'quoteSettings'
    ]);
    const mockCommercialExceptions = { enableWorkFlow: true } as unknown as CommercialExceptionsModel;
    const mockConfig = {
      manifest: {},
      initializedModel: () => {},
      signModel: () => {}
    };

    journeySpy.quoteSettings.and.returnValue(Promise.resolve({ commercialExceptions: mockCommercialExceptions } as QuoteSettingsModel));

    contextSpy.get.and.returnValue({
      configuration: { name: 'name', version: { last: 'v0.0' } },
      settings: { commercialExceptions: mockCommercialExceptions }
    });

    TestBed.configureTestingModule({
      providers: [
        SettingsService,
        { provide: TranslateService, useValue: translateSpy },
        { provide: ContextDataService, useValue: contextSpy },
        { provide: JourneyService, useValue: journeySpy },
        { provide: QUOTE_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    });

    service = TestBed.inject(SettingsService);
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    contextDataServiceSpy = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    journeyServiceSpy = TestBed.inject(JourneyService) as jasmine.SpyObj<JourneyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings and set default language', async () => {
    const settings: QuoteSettingsModel = { office: 10, commercialExceptions: { enableWorkFlow: true } } as QuoteSettingsModel;
    journeyServiceSpy.quoteSettings.and.returnValue(Promise.resolve(settings));
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ name: 'name', homePageId: 'page', pageMap: { page: { pageId: 'id' } }, version: {} } as unknown as Configuration)
    );
    journeyServiceSpy.clientJourney.and.returnValue(Promise.resolve({} as JourneyInfo));

    await service.loadSettings();

    expect(translateServiceSpy.setDefaultLang).toHaveBeenCalledWith('es-ES');
  });

  it('should disable workflow if commercialExceptions.enableWorkFlow is false', async () => {
    const settings: QuoteSettingsModel = { office: 10, commercialExceptions: { enableWorkFlow: false } } as QuoteSettingsModel;
    journeyServiceSpy.quoteSettings.and.returnValue(Promise.resolve(settings));
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ name: 'name', homePageId: 'page', pageMap: { page: { pageId: 'id' } }, version: {} } as unknown as Configuration)
    );
    journeyServiceSpy.clientJourney.and.returnValue(Promise.resolve({} as JourneyInfo));

    await service.loadSettings();

    expect(journeyServiceSpy.clientJourney).toHaveBeenCalledWith(QUOTE_JOURNEY_DISALED);
    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });

  it('should load context if commercialExceptions.enableWorkFlow is true', async () => {
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ name: 'name', homePageId: 'page', pageMap: { page: { pageId: 'id' } }, version: {} } as unknown as Configuration)
    );
    journeyServiceSpy.clientJourney.and.returnValue(Promise.resolve({} as JourneyInfo));

    await service.loadSettings();

    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });
});
