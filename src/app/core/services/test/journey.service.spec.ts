/* eslint-disable @typescript-eslint/no-empty-function */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NX_WORKFLOW_TOKEN } from '../../components/constants';
import { Configuration, ConfigurationDTO, dataHash, JourneyInfo, QuoteSettingsModel, Version } from '../../models';
import { JourneyService } from '../journey.service';
import { LiteralsService } from '../literals.service';

describe('JourneyService', () => {
  let service: JourneyService;
  let httpMock: HttpTestingController;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let httpService: jasmine.SpyObj<HttpService>;
  let literalService: jasmine.SpyObj<LiteralsService>;
  const mockConfig = {
    errorPageId: 'error',
    manifest: {},
    initializedModel: () => {},
    signModel: () => {}
  };

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const httpServiceSpy = jasmine.createSpyObj('HttpService', ['get']);
    const literalServiceSpy = jasmine.createSpyObj('LiteralsService', ['toString']);

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        JourneyService,
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: LiteralsService, useValue: literalServiceSpy },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    });

    service = TestBed.inject(JourneyService);
    httpMock = TestBed.inject(HttpTestingController);
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    httpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
    literalService = TestBed.inject(LiteralsService) as jasmine.SpyObj<LiteralsService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shoult get client journey', async () => {
    const journeyName = 'test';
    const info: Record<string, JourneyInfo> = { '1': { name: journeyName } };
    const settitngs: QuoteSettingsModel = { office: 1, commercialExceptions: { enableWorkFlow: true } } as QuoteSettingsModel;

    httpService.get.and.returnValue(of(info));

    service.clientJourney(`${settitngs}`).then(result => {
      expect(result.name).toBe(journeyName);
    });
  });

  it('should fetch configuration', async () => {
    const dtoVersion: Version = 'v1.1.0';
    const journeyName = 'test';
    const mockConfigurationDTO = {
      version: [{ value: dtoVersion }],
      homePageId: 'home',
      title: 'home',
      errorPageId: 'error',
      pageMap: [
        {
          pageId: 'error',
          route: 'new-error-screen',
          configuration: { literals: { body: 'error message' } }
        }
      ],
      steppers: [],
      links: {},
      literals: {}
    } as unknown as ConfigurationDTO;

    const { ...significantData } = mockConfigurationDTO;

    const mockConfiguration = {
      name: journeyName,
      version: { actual: 'v1.0.0' },
      releaseDate: undefined,
      homePageId: 'home',
      title: 'home',
      errorPageId: 'error',
      pageMap: {
        error: {
          pageId: 'error',
          route: 'new-error-screen',
          configuration: { literals: { body: 'error message' } }
        }
      },
      links: { error: 'error' },
      steppers: {},
      literals: {},
      hash: dataHash(significantData)
    } as unknown as Configuration;

    httpService.get.and.returnValue(of(mockConfigurationDTO));
    contextDataService.get.and.returnValue({ configuration: { version: {}, hash: 'oldHash' } });

    const result = await service.fetchConfiguration(journeyName, [{ value: dtoVersion }]);

    console.log(JSON.stringify(result));

    expect(result).toEqual({ ...mockConfiguration, version: { actual: dtoVersion, last: dtoVersion } });
    expect(httpService.get).toHaveBeenCalledWith(`${environment.baseUrl}/journey/test`);
  });

  it('should set error page if not present in pageMap', () => {
    const configuration = {
      homePageId: 'home',
      errorPageId: 'error',
      pageMap: {},
      links: {}
    } as Configuration;

    service['setErrorPage'](configuration, 'error');

    expect(configuration.pageMap['error']).toBeTruthy();
    expect(configuration.links?.['error']).toBe('error');
  });

  it('should normalize text for URI', () => {
    literalService.toString.and.returnValue('Test Label');

    const result = service['normalizeTextForUri']({ value: 'test' });

    expect(result).toBe('test-label');
    expect(literalService.toString).toHaveBeenCalledWith({ value: 'test' });
  });
});
