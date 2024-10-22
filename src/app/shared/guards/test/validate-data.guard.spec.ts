import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { AppContextData, QuoteComponent } from 'src/app/core/models';
import { isValidGuard } from '../validate-data.guard';

describe('isValidGuard', () => {
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let component: jasmine.SpyObj<QuoteComponent>;
  let currentRoute: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;
  let next: RouterStateSnapshot;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const quoteComponentSpy = jasmine.createSpyObj('QuoteComponent', ['canDeactivate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: QuoteComponent, useValue: quoteComponentSpy }
      ]
    });

    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    component = TestBed.inject(QuoteComponent) as jasmine.SpyObj<QuoteComponent>;
    currentRoute = new ActivatedRouteSnapshot();
    state = {} as RouterStateSnapshot;
    next = {} as RouterStateSnapshot;
  });

  it('should allow deactivation if isPreviousStep returns true', () => {
    const context = {
      navigation: {
        nextPage: { pageId: 'nextPageId' },
        viewedPages: ['nextPageId']
      }
    } as AppContextData;
    contextDataService.get.and.returnValue(context);

    const result = TestBed.runInInjectionContext(() => {
      return isValidGuard(component, currentRoute, state, next);
    });

    expect(result).toBeTrue();
  });

  it('should allow deactivation if stepperChange returns true', () => {
    const context = {
      navigation: {
        viewedPages: ['someOtherPageId'],
        nextPage: { stepper: { key: 'stepper1' } },
        lastPage: { stepper: { key: 'stepper2' } }
      }
    } as AppContextData;

    contextDataService.get.and.returnValue(context);

    const result = TestBed.runInInjectionContext(() => {
      return isValidGuard(component, currentRoute, state, next);
    });

    expect(result).toBeTrue();
  });

  it('should call component.canDeactivate if isPreviousStep and stepperChange return false', () => {
    const context = {
      navigation: {
        nextPage: { pageId: 'nextPageId', stepper: { key: 'stepper1', stepKey: 'stepKey1' } },
        lastPage: { pageId: 'lastPageId', stepper: { key: 'stepper1', stepKey: 'stepKey2' } },
        viewedPages: ['someOtherPageId']
      }
    } as AppContextData;

    contextDataService.get.and.returnValue(context);

    const result = TestBed.runInInjectionContext(() => {
      return isValidGuard(component, currentRoute, state, next);
    });

    if (component.canDeactivate) {
      expect(component.canDeactivate).toHaveBeenCalledWith(currentRoute, state, next);
    }
    expect(result).toBeTrue();
  });

  it('should return true if component.canDeactivate is not defined', () => {
    const context = {
      navigation: {
        nextPage: { pageId: 'nextPageId', stepper: { key: 'stepper1', stepKey: 'stepKey1' } },
        lastPage: { pageId: 'lastPageId', stepper: { key: 'stepper1', stepKey: 'stepKey2' } },
        viewedPages: ['someOtherPageId']
      }
    } as AppContextData;

    contextDataService.get.and.returnValue(context);
    component.canDeactivate = undefined;

    const result = TestBed.runInInjectionContext(() => {
      return isValidGuard(component, currentRoute, state, next);
    });

    expect(result).toBeTrue();
  });
});
