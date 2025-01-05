/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { environment } from 'src/environments/environment';
import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;

  beforeEach(async () => {
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ConfirmationComponent,
        NxButtonModule,
        NxCopytextModule,
        NxHeadlineModule,
        QuoteFooterComponent,
        HeaderTitleComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        name: 'John Doe'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set href to environment baseUrl', () => {
    expect(component.href).toBe(environment.baseUrl);
  });

  xit('should navigate to the correct URL on finishFlow', () => {
    const originalAssign = window.location.assign;
    const assignSpy = jasmine.createSpy('assign');

    (window.location as any).assign = assignSpy;

    component.finishFlow();

    expect(assignSpy).toHaveBeenCalledWith(environment.baseUrl);

    window.location.assign = originalAssign;
  });
});
