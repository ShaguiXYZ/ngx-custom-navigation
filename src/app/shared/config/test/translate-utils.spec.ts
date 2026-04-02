import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader, CustomMissingTranslationHandler } from '../translate.config';

describe('TranslateUtils', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: createTranslateLoader(),
          missingTranslationHandler: { provide: CustomMissingTranslationHandler }
        })
      ],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create TranslateHttpLoader providers', () => {
    const loaderProviders = createTranslateLoader();
    expect(Array.isArray(loaderProviders)).toBeTrue();
    expect(loaderProviders.length).toBeGreaterThan(0);
  });

  it('should handle missing translations', () => {
    const handler = new CustomMissingTranslationHandler();
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);
    const result = handler.handle({ key: 'missing.key', translateService: translateServiceMock });

    expect(result).toBe(undefined);
  });

  it('should log a warning for missing translations', () => {
    const consoleWarnSpy = spyOn(console, 'warn');
    const handler = new CustomMissingTranslationHandler();
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);

    handler.handle({ key: 'missing.key', translateService: translateServiceMock });
    expect(consoleWarnSpy).toHaveBeenCalledWith('i18n: Parameter not found', 'missing.key');
  });
});
