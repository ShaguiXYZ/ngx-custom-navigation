import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE, NxDatefieldModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import moment from 'moment';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceMock } from 'src/app/core/mock/services';
import { HeaderTitleComponent, QuoteFooterComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteModel } from 'src/app/shared/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { DateOfIssueComponent } from './date-of-issue.component';

describe('DateOfIssueComponent', () => {
  let component: DateOfIssueComponent;
  let fixture: ComponentFixture<DateOfIssueComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        DateOfIssueComponent,
        FormsModule,
        ReactiveFormsModule,
        NxDatefieldModule,
        NxFormfieldModule,
        NxInputModule,
        NxMomentDateModule,
        HeaderTitleComponent,
        QuoteFooterComponent,
        QuoteLiteralDirective,
        QuoteLiteralPipe
      ],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateOfIssueComponent);
    component = fixture.componentInstance;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      dateOfIssue: {
        dateOfIssue: '01-01-2003'
      }
    } as unknown as QuoteModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    const dateOfIssue = moment(new Date(component.form.controls['dateOfIssue'].value)).format('YYYY-MM-DD');

    expect(dateOfIssue).toEqual('2003-01-01');
  });

  it('should mark form as touched and update context data on updateValidData', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.controls['dateOfIssue'].setValue('2023-01-02');
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(component.form.touched).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(
      QUOTE_CONTEXT_DATA,
      jasmine.objectContaining({
        dateOfIssue: { dateOfIssue: '2023-01-02' }
      })
    );
  });

  it('should return form validity on canDeactivate', done => {
    component.form.controls['dateOfIssue'].setValue('2023-01-02');
    const result = component.canDeactivate();

    expect(result).toBeTrue();
    done();
  });

  it('should invalidate form if dateOfIssue is empty', () => {
    component.form.controls['dateOfIssue'].setValue(null);
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(component.form.controls['dateOfIssue'].hasError('required')).toBeTrue();
  });
});
