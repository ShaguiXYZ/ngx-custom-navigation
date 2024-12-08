import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader, CustomMissingTranslationHandler } from '../translate-utils';

describe('TranslateUtils', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          },
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

  it('should create TranslateHttpLoader', () => {
    const loader = createTranslateLoader(httpClient);
    expect(loader).toBeTruthy();
  });

  it('should handle missing translations', () => {
    const handler = new CustomMissingTranslationHandler();
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);
    const result = handler.handle({ key: 'missing.key', translateService: translateServiceMock });

    expect(result).toBe('');
  });

  it('should log a warning for missing translations', () => {
    const consoleWarnSpy = spyOn(console, 'warn');
    const handler = new CustomMissingTranslationHandler();
    const translateServiceMock = jasmine.createSpyObj('TranslateService', ['get']);

    handler.handle({ key: 'missing.key', translateService: translateServiceMock });
    expect(consoleWarnSpy).toHaveBeenCalledWith('i18n: Parameter not found', 'missing.key');
  });
});
