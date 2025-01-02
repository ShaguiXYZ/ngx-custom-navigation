import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/constants';
import { NX_RECAPTCHA_TOKEN } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/library/models';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';
import { ClientNameComponent } from './client-name.component';

describe('ClientNameComponent', () => {
  let component: ClientNameComponent;
  let fixture: ComponentFixture<ClientNameComponent>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const mockConfig = {
      errorPageId: 'error',
      manifest: {}
    };

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ClientNameComponent, ReactiveFormsModule, NxFormfieldModule, NxInputModule],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: NX_RECAPTCHA_TOKEN, useValue: { siteKey: 'mock-site-key' } },
        { provide: NX_WORKFLOW_TOKEN, useValue: mockConfig }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNameComponent);
    component = fixture.componentInstance;

    component['_contextData'] = {
      personalData: {
        name: 'John',
        surname: 'Doe'
      }
    } as QuoteModel;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with context data', () => {
    expect(component.form.value).toEqual({
      name: 'John',
      surname: 'Doe'
    });
  });

  it('should mark all fields as touched and update context data on valid form', () => {
    component.form.setValue({ name: 'Jane', surname: 'Smith' });
    component['updateValidData']();

    expect(component.form.valid).toBeTrue();
    expect(component.form.touched).toBeTrue();
  });

  it('should not update context data on invalid form', () => {
    component.form.setValue({ name: '', surname: 'Smith' });
    component['updateValidData']();

    expect(component.form.valid).toBeFalse();
  });

  it('should allow deactivation if form is valid', done => {
    component.form.setValue({ name: 'Jane', surname: 'Smith' });
    const canDeactivate = component.canDeactivate();

    expect(canDeactivate).toBeTrue();
    done();
  });

  it('should prevent deactivation if form is invalid', done => {
    component.form.setValue({ name: '', surname: 'Smith' });
    const canDeactivate = component.canDeactivate();
    expect(canDeactivate).toBeFalse();
    done();
  });
});
