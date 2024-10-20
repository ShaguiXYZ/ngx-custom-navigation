import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { ContactUsComponent } from './contact-us.component';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ContactUsComponent,
        NxHeadlineModule,
        NxCopytextModule,
        NxIconModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have footerConfig with showNext set to true', () => {
    expect(component.footerConfig.showNext).toBeTrue();
  });

  it('should render HeaderTitleComponent', () => {
    const headerTitleElement = fixture.debugElement.query(By.directive(HeaderTitleComponent));
    expect(headerTitleElement).toBeTruthy();
  });

  it('should render QuoteFooterComponent', () => {
    const quoteFooterElement = fixture.debugElement.query(By.directive(QuoteFooterComponent));
    expect(quoteFooterElement).toBeTruthy();
  });

  it('should apply QuoteLiteralDirective', () => {
    const quoteLiteralElement = fixture.debugElement.query(By.directive(QuoteLiteralDirective));
    expect(quoteLiteralElement).toBeTruthy();
  });
});
