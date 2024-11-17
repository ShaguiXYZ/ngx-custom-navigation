import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ApologyComponent } from './apology-screen.component';

describe('ApologyComponent', () => {
  let component: ApologyComponent;
  let fixture: ComponentFixture<ApologyComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ApologyComponent,
        NxButtonModule,
        NxCardModule,
        NxCopytextModule,
        NxHeadlineModule,
        NxIconModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApologyComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render HeaderTitleComponent', () => {
    const headerTitleElement = fixture.debugElement.nativeElement.querySelector('quote-header-title');
    expect(headerTitleElement).not.toBeNull();
  });

  it('should render QuoteFooterComponent', () => {
    const quoteFooterElement = fixture.debugElement.nativeElement.querySelector('quote-footer');
    expect(quoteFooterElement).not.toBeNull();
  });
});
