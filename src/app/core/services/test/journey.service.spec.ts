import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from '../../components/models';
import { Configuration, ConfigurationDTO, JourneyInfo, QuoteSettingsModel, Version } from '../../models';
import { JourneyService } from '../journey.service';
import { LiteralsService } from '../literals.service';

describe('JourneyService', () => {
  let service: JourneyService;
  let httpMock: HttpTestingController;
  let httpService: jasmine.SpyObj<HttpService>;
  let literalService: jasmine.SpyObj<LiteralsService>;
  const mockConfig = {
    errorPageId: 'error',
    manifest: {},
    initializedModel: () => {
      // empty
    },
    signModel: () => {
      // empty
    }
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
    const journeyId = 'test';
    const info: JourneyInfo = { id: journeyId };
    const settitngs: QuoteSettingsModel = { journey: 'id', commercialExceptions: {} } as QuoteSettingsModel;

    httpService.get.and.returnValue(of(info));

    service.journeySettings(`${settitngs}`).then(result => {
      expect(result.id).toBe(journeyId);
    });
  });

  it('should fetch configuration', async () => {
    const dtoVersion: Version = 'v1.1.0';
    const journeyId = 'test';
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

    const hash = service['configuration_Hash'](journeyName, mockConfigurationDTO);

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
      hash
    } as unknown as Configuration;

    httpService.get.and.returnValue(of(mockConfigurationDTO));

    const result = await service.fetchConfiguration({ id: journeyId, versions: [{ value: dtoVersion }] });

    expect(result).toEqual({ ...mockConfiguration, version: { actual: dtoVersion, last: dtoVersion } });
    expect(httpService.get).toHaveBeenCalledWith(`/journey/test`);
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
