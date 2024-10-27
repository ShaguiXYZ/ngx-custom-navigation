import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NX_DATE_LOCALE } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteModel } from 'src/app/shared/models';
import { ClientNameComponent } from './client-name.component';

describe('ClientNameComponent', () => {
  let component: ClientNameComponent;
  let fixture: ComponentFixture<ClientNameComponent>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const translationsServiceSpy = jasmine.createSpyObj('TranslationsService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ClientNameComponent, ReactiveFormsModule, FormsModule, NxFormfieldModule, NxInputModule],
      providers: [
        { provide: NX_DATE_LOCALE, useValue: 'es-ES' },
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: TranslateService, useValue: translationsServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNameComponent);
    component = fixture.componentInstance;

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;

    contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, {
      personalData: {
        name: 'John',
        surname: 'Doe'
      }
    } as QuoteModel);

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
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ name: 'Jane', surname: 'Smith' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeTrue();
    expect(component.form.touched).toBeTrue();
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, {
      personalData: {
        name: 'Jane',
        surname: 'Smith'
      }
    });
  });

  it('should not update context data on invalid form', () => {
    const setContextDataSpy = spyOn(contextDataService, 'set');

    component.form.setValue({ name: '', surname: 'Smith' });
    const isValid = component['updateValidData']();

    expect(isValid).toBeFalse();
    expect(setContextDataSpy).not.toHaveBeenCalled();
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
