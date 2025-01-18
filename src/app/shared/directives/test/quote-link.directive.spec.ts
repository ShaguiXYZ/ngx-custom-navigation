import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteLinkDirective } from '../quote-link.directive';

@Component({
    template: `<div nxQuoteLink="testLink"></div>`,
    standalone: false
})
class TestComponent {}

describe('QuoteLinkDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directiveEl: DebugElement;
  let contextDataService: jasmine.SpyObj<ContextDataService>;
  let routingService: jasmine.SpyObj<RoutingService>;

  beforeEach(() => {
    const contextDataServiceSpy = jasmine.createSpyObj('ContextDataService', ['get']);
    const routingServiceSpy = jasmine.createSpyObj('RoutingService', ['goToPage']);

    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [QuoteLinkDirective],
      providers: [
        { provide: ContextDataService, useValue: contextDataServiceSpy },
        { provide: RoutingService, useValue: routingServiceSpy }
      ]
    });

    fixture = TestBed.createComponent(TestComponent);
    directiveEl = fixture.debugElement.query(By.directive(QuoteLinkDirective));
    contextDataService = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
    routingService = TestBed.inject(RoutingService) as jasmine.SpyObj<RoutingService>;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(directiveEl).toBeTruthy();
  });

  it('should call routingService.goToPage with the correct link on click', () => {
    const mockAppContextData: AppContextData = {
      configuration: {
        links: {
          testLink: 'http://example.com'
        }
      }
    } as unknown as AppContextData;

    contextDataService.get.and.returnValue(mockAppContextData);

    directiveEl.triggerEventHandler('click', null);

    expect(routingService.goToPage).toHaveBeenCalledWith('http://example.com');
  });

  it('should not call routingService.goToPage if link is not found', () => {
    const mockAppContextData: AppContextData = {
      configuration: {
        links: {}
      }
    } as unknown as AppContextData;

    contextDataService.get.and.returnValue(mockAppContextData);

    directiveEl.triggerEventHandler('click', null);

    expect(routingService.goToPage).not.toHaveBeenCalled();
  });
});
