/* eslint-disable @typescript-eslint/no-empty-function */
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from '../../components/models';
import { CommercialExceptionsModel, Configuration, JourneyInfo, QuoteSettingsModel } from '../../models';
import { JourneyService } from '../journey.service';
import { SettingsService } from '../setting.service';

describe('SettingsService', () => {
  let service: SettingsService;
  // let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;
  let journeyServiceSpy: jasmine.SpyObj<JourneyService>;

  beforeEach(() => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
    const contextSpy = jasmine.createSpyObj('ContextDataService', ['set', 'get']);
    const journeySpy = jasmine.createSpyObj('JourneyService', [
      'journeySettings',
      'fetchConfiguration',
      'hasBreakingChange',
      'quoteSettings'
    ]);
    const mockCommercialExceptions = {} as unknown as CommercialExceptionsModel;
    const mockConfig = {
      manifest: {},
      initialize: () => {},
      hash: () => {}
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
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    });

    service = TestBed.inject(SettingsService);
    // translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    contextDataServiceSpy = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    journeyServiceSpy = TestBed.inject(JourneyService) as jasmine.SpyObj<JourneyService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load context', async () => {
    journeyServiceSpy.fetchConfiguration.and.returnValue(
      Promise.resolve({ name: 'name', homePageId: 'page', pageMap: { page: { pageId: 'id' } }, version: {} } as unknown as Configuration)
    );
    journeyServiceSpy.journeySettings.and.returnValue(Promise.resolve({} as JourneyInfo));

    await service.loadSettings();

    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });
});
