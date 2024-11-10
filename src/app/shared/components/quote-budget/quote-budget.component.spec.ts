/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService, NotificationService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { Budget } from 'src/app/core/models';
import { BudgetService, RoutingService } from 'src/app/core/services';
import { ContextDataServiceStub } from 'src/app/core/stub';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteBudgetComponent } from './quote-budget.component';

describe('QuoteBudgetComponent', () => {
  let component: QuoteBudgetComponent;
  let fixture: ComponentFixture<QuoteBudgetComponent>;
  let budgetService: jasmine.SpyObj<BudgetService>;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let routingService: jasmine.SpyObj<RoutingService>;
  let quoteLiteralPipe: jasmine.SpyObj<QuoteLiteralPipe>;

  beforeEach(async () => {
    const budgetServiceSpy = jasmine.createSpyObj('BudgetService', ['retrieveBudget', 'storeBudget']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['info']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['resetNavigation']);
    const quoteLiteralPipeSpy = jasmine.createSpyObj('QuoteLiteralPipe', ['transform']);
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['translate']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        QuoteBudgetComponent,
        ReactiveFormsModule,
        NxButtonModule,
        NxCopytextModule,
        NxFormfieldModule,
        NxInputModule,
        NxTabsModule
      ],
      providers: [
        { provide: ContextDataService, useClass: ContextDataServiceStub },
        { provide: BudgetService, useValue: budgetServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy },
        { provide: QuoteLiteralPipe, useValue: quoteLiteralPipeSpy },
        { provide: TranslateService, useValue: translateServiceSpy }
      ]
    }).compileComponents();

    TestBed.overrideComponent(QuoteBudgetComponent, {
      set: {
        providers: [{ provide: BudgetService, useValue: budgetServiceSpy }]
      }
    });

    fixture = TestBed.createComponent(QuoteBudgetComponent);
    component = fixture.componentInstance;
    budgetService = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;
    quoteLiteralPipe = TestBed.inject(QuoteLiteralPipe) as jasmine.SpyObj<QuoteLiteralPipe>;

    fixture.detectChanges();

    routingServiceSpy.resetNavigation.and.returnValue(Promise.resolve(true));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form on init', () => {
    component.ngOnInit();
    expect(component.form).toBeDefined();
    expect(component.form.get('retrieveBudget')).toBeDefined();
    expect(component.form.get('storeBudget')).toBeDefined();
  });

  it('should retrieve budget and set context data', () => {
    const budget = { context: {}, quote: {} } as Budget;

    const setContextDataSpy = spyOn(contextDataService, 'set');

    budgetService.retrieveBudget.and.returnValue(budget);

    component.form.get('retrieveBudget')?.get('storePassKey')?.setValue('testKey');
    component.retrieveBudget();

    expect(budgetService.retrieveBudget).toHaveBeenCalledWith('testKey');
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA, budget.context);
    expect(setContextDataSpy).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, budget.quote);
    expect(routingService.resetNavigation).toHaveBeenCalled();
  });

  it('should store budget and copy to clipboard', () => {
    const storeName = 'testStore';
    const budgetKey = 'budgetKey';
    budgetService.storeBudget.and.returnValue(budgetKey);

    spyOn(component as any, 'copyToClipboard').and.returnValue(Promise.resolve());

    component.form.get('storeBudget')?.get('storeName')?.setValue(storeName);
    component.storeBudget();

    expect(budgetService.storeBudget).toHaveBeenCalledWith(storeName);
    expect(component['copyToClipboard']).toHaveBeenCalledWith(budgetKey);
  });

  it('should copy to clipboard and show notification', async () => {
    const value = 'testValue';
    quoteLiteralPipe.transform.and.returnValue('Copied to clipboard');

    // @ howto Simulate clipboard functionality
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

    await component['copyToClipboard'](value);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(value);
    expect(notificationService.info).toHaveBeenCalledWith('Copied to clipboard', value);
  });
});
