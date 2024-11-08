import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { JourneyHomeComponent } from './journey-home.component';

describe('JourneyHomeComponent', () => {
  let component: JourneyHomeComponent;
  let fixture: ComponentFixture<JourneyHomeComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockContextDataService: jasmine.SpyObj<ContextDataService>;
  let mockRoutingService: jasmine.SpyObj<RoutingService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockContextDataService = jasmine.createSpyObj('ContextDataService', ['get', 'set']);
    mockRoutingService = jasmine.createSpyObj('RoutingService', ['someMethod']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [JourneyHomeComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ContextDataService, useValue: mockContextDataService },
        { provide: RoutingService, useValue: mockRoutingService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyHomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to homePageId route on init', () => {
    const mockContext: AppContextData = {
      configuration: {
        homePageId: 'home',
        errorPageId: 'error',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    };

    mockContextDataService.get.and.returnValue(mockContext);

    component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['home-route'], { skipLocationChange: true });
  });

  it('should throw error if homePageId is not found', () => {
    const mockContext: AppContextData = {
      configuration: {
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home-route'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    } as unknown as AppContextData;

    mockContextDataService.get.and.returnValue(mockContext);

    expect(() => component.ngOnInit()).toThrowError('Home page not found in configuration');
  });
});
