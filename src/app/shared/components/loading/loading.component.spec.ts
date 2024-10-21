/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { LoadingService } from '@shagui/ng-shagui/core';
import { of } from 'rxjs';
import { QuoteLoadingComponent } from './loading.component';

describe('QuoteLoadingComponent', () => {
  let component: QuoteLoadingComponent;
  let fixture: ComponentFixture<QuoteLoadingComponent>;
  let dialogService: jasmine.SpyObj<NxDialogService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let templateRef: jasmine.SpyObj<TemplateRef<any>>;

  beforeEach(async () => {
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['asObservable']);
    const dialogServiceSpy = jasmine.createSpyObj('NxDialogService', ['open']);

    templateRef = jasmine.createSpyObj('TemplateRef', ['']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteLoadingComponent],
      providers: [
        provideAnimations(),
        { provide: NxDialogService, useValue: dialogServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    loadingService.asObservable.and.returnValue(of(false));

    dialogService = TestBed.inject(NxDialogService) as jasmine.SpyObj<NxDialogService>;
    dialogService.open.and.returnValue(jasmine.createSpyObj('NxModalRef', ['close']));

    templateRef = jasmine.createSpyObj('TemplateRef', ['']);

    fixture = TestBed.createComponent(QuoteLoadingComponent);
    component = fixture.componentInstance;
    component['templateLoadingRef'] = templateRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should open loading modal when loadingService emits true', () => {
    const modalRef = jasmine.createSpyObj('NxModalRef', ['close']);
    dialogService.open.and.returnValue(modalRef);

    loadingService.asObservable.and.returnValue(of(true));

    component.ngOnInit();

    fixture.detectChanges();

    expect(dialogService.open).toHaveBeenCalled();
  });

  it('should close loading modal when loadingService emits false', () => {
    const modalRef = jasmine.createSpyObj('NxModalRef', ['close']);
    component['templateLoadingDialogRef'] = modalRef;

    loadingService.asObservable.and.returnValue(of(false));

    component.ngOnInit();

    expect(modalRef.close).toHaveBeenCalled();
  });

  it('should unsubscribe from loadingService on destroy', () => {
    const subscriptionSpy = spyOn(component['loadingObs'], 'unsubscribe');
    component.ngOnDestroy();

    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
