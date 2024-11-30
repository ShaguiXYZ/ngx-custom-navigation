/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from '../../constants';
import { AppContextData, ConfigurationDTO } from '../../models';
import { LiteralsService } from '../literals.service';
import { SettingsService } from '../setting.service';

describe('SettingsService', () => {
  let service: SettingsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(() => {
    contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        SettingsService,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        LiteralsService
      ]
    });

    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load settings and update context data', async () => {
    const settings = {
      commercialExceptions: {
        enableWorkFlow: true
      }
    };

    const mockConfiguration: ConfigurationDTO = {
      homePageId: 'home',
      lastUpdate: new Date('2023-10-01'),
      pageMap: [{ pageId: 'home' }],
      steppers: [
        {
          steps: [
            {
              label: 'Step 1',
              pages: ['home']
            }
          ]
        }
      ],
      links: {},
      literals: {}
    };

    const appContextData = {
      settings: {},
      configuration: {
        homePageId: mockConfiguration.homePageId,
        errorPageId: 'error',
        lastUpdate: mockConfiguration.lastUpdate,
        pageMap: {
          home: {
            pageId: 'home'
          }
        },
        steppers: {
          steppersMap: {
            '1': {
              steps: [
                {
                  key: '1',
                  label: 'Step 1',
                  pages: ['home']
                }
              ]
            }
          }
        },
        links: {},
        literals: {}
      },
      navigation: {
        viewedPages: []
      }
    };

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return appContextData;
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {};
      }
      return null;
    });

    httpClientSpy.get.and.returnValues(of(settings), of(mockConfiguration));

    await service.loadSettings();

    expect(httpClientSpy.get.calls.count()).withContext('two calls').toBe(1);
    expect(contextDataServiceSpy.set).toHaveBeenCalled();
  });

  it('should initialize configuration correctly', () => {
    const mockConfigurationDTO: ConfigurationDTO = {
      homePageId: 'home',
      lastUpdate: new Date('2023-10-01'),
      pageMap: [{ pageId: 'home' }],
      steppers: [],
      links: {},
      literals: {}
    };

    const configuration = service['init'](mockConfigurationDTO);

    expect(configuration.homePageId).toBe(mockConfigurationDTO.homePageId);
    expect(configuration.lastUpdate).toBe(mockConfigurationDTO.lastUpdate);
    expect(configuration.pageMap['home'].pageId).toBe('home');
  });

  it('should normalize text for URI', () => {
    const text = { value: 'Hello World' };
    const normalizedText = service['normalizeTextForUri'](text);

    expect(normalizedText).toBe('hello-world');
  });
});
