/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { of, Subject } from 'rxjs';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { NX_LANGUAGE_CONFIG } from 'src/app/core/models';
import { ServiceActivatorService } from 'src/app/core/service-activators';
import { NX_RECAPTCHA_TOKEN, RoutingService } from 'src/app/core/services';
import { QuoteTrackService } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { NumberAccidentsComponent } from './number-accidents.component';

describe('NumberAccidentsComponent', () => {
  let component: NumberAccidentsComponent;
  let fixture: ComponentFixture<NumberAccidentsComponent>;

  beforeEach(async () => {
    const quoteTrackServiceSpy = jasmine.createSpyObj('QuoteTrackService', ['trackView']);
    const contextDataSubject = new Subject<any>();
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['next']);
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get', 'set', 'onDataChange']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate', 'setDefaultLang', 'use', 'instant']);
    const activateEntryPointSpy = jasmine.createSpyObj('ServiceActivatorService', ['activateEntryPoint']);
    const mockWorkflowConfig = {
      errorPageId: 'error',
      manifest: {}
    };
    const mockLanguageConfig = {
      current: 'en',
      languages: ['en', 'fr']
    };

    translateServiceSpy.use.and.returnValue(of('en'));

    contextDataServiceSpy.onDataChange.and.returnValue(contextDataSubject.asObservable());

    contextDataServiceSpy.get.and.callFake((contextDataKey: string): any => {
      if (contextDataKey === QUOTE_APP_CONTEXT_DATA) {
        return { navigation: { lastPage: 'page' }, configuration: { literals: {} } };
      } else if (contextDataKey === QUOTE_CONTEXT_DATA) {
        return {
          accidents: 2
        };
      }

      return null;
    });

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        NumberAccidentsComponent,
        NxCopytextModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        SelectableOptionComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: ServiceActivatorService, useValue: activateEntryPointSpy },
        { provide: QuoteTrackService, useValue: quoteTrackServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockWorkflowConfig },
        { provide: NX_LANGUAGE_CONFIG, useValue: mockLanguageConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberAccidentsComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      client: {
        accidents: 2
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize contextData and selectedAccidents on ngOnInit', () => {
    component.ngOnInit();

    expect(component['_contextData']).toEqual({
      client: { accidents: 2 }
    } as QuoteModel);
    expect(component.selectedAccidents).toEqual({ index: 2, data: 'accidents' });
  });

  it('should return true if accidents value is valid in updateValidData', () => {
    component['_contextData'] = { client: { accidents: 1 } } as QuoteModel;

    expect(component['updateValidData']()).toBeTrue();
  });

  it('should return false if accidents value is invalid in updateValidData', () => {
    component['_contextData'] = { client: { accidents: null } } as unknown as QuoteModel;

    expect(component['updateValidData']()).toBeFalse();
  });

  it('should call updateValidData on canDeactivate', () => {
    spyOn(component as any, 'updateValidData').and.callThrough();
    component.canDeactivate();

    expect(component['updateValidData']).toHaveBeenCalled();
  });
});
