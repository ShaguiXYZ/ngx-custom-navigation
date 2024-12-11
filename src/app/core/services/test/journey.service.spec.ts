import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContextDataService, HttpService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Configuration, ConfigurationDTO, dataHash, Version, VersionInfo } from '../../models';
import { JourneyService } from '../journey.service';
import { LiteralsService } from '../literals.service';

describe('JourneyService', () => {
  let service: JourneyService;
  let httpMock: HttpTestingController;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let httpService: jasmine.SpyObj<HttpService>;
  let literalService: jasmine.SpyObj<LiteralsService>;

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
        { provide: LiteralsService, useValue: literalServiceSpy }
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

  it('should fetch configuration', async () => {
    const dtoVersion: Version = 'v1.1.0';
    const lastUpdate = new Date('2023-10-01');
    const mockConfigurationDTO = {
      version: [{ value: dtoVersion }],
      homePageId: 'home',
      title: 'home',
      lastUpdate,
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

    const { version, ...significantData } = mockConfigurationDTO;

    const mockConfiguration = {
      version: 'v1.0.0',
      homePageId: 'home',
      title: 'home',
      errorPageId: 'error',
      lastUpdate,
      pageMap: {
        error: {
          pageId: 'error',
          route: 'new-error-screen',
          configuration: { literals: { body: 'error message' } }
        }
      },
      links: { error: 'error' },
      steppers: { steppersMap: {} },
      literals: {},
      hash: dataHash(significantData)
    } as unknown as Configuration;

    httpService.get.and.returnValue(of(mockConfigurationDTO));
    contextDataService.get.and.returnValue({ version: 'v1.0.0', configuration: { hash: 'oldHash' } });

    const result = await service.fetchConfiguration('test');

    console.log(JSON.stringify(result));

    expect(result).toEqual({ configuration: { ...mockConfiguration, version: dtoVersion }, properties: { breakingchange: true } });
    expect(httpService.get).toHaveBeenCalledWith(`${environment.baseUrl}/journey/test`);
  });

  it('should set error page if not present in pageMap', () => {
    const configuration = {
      homePageId: 'home',
      errorPageId: 'error',
      lastUpdate: new Date('2023-10-01'),
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
