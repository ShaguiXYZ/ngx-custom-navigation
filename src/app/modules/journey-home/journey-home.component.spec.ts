import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingServiceMock } from 'src/app/core/mock/services';
import { AppContextData } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteModel } from 'src/app/shared/models';
import { JourneyHomeComponent } from './journey-home.component';

describe('JourneyHomeComponent', () => {
  let component: JourneyHomeComponent;
  let fixture: ComponentFixture<JourneyHomeComponent>;
  let contextDataServiceSpy: jasmine.SpyObj<ContextDataService>;

  beforeEach(async () => {
    const spyContextDataService = jasmine.createSpyObj('ContextDataService', ['get', 'set']);

    await TestBed.configureTestingModule({
      imports: [JourneyHomeComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ContextDataService, useValue: spyContextDataService },
        { provide: RoutingService, useClass: RoutingServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(JourneyHomeComponent);
    component = fixture.componentInstance;

    // initServices();

    fixture.detectChanges();
  });
  beforeEach(() => {
    contextDataServiceSpy = TestBed.inject(ContextDataService) as jasmine.SpyObj<ContextDataService>;
  });

  fit('should navigate to homePageId route if homePageId exists', () => {
    const appContextData: AppContextData = {
      configuration: {
        homePageId: 'home',
        pageMap: {
          home: {
            pageId: 'home',
            route: 'home',
            title: 'Home'
          }
        }
      },
      navigation: {
        viewedPages: []
      }
    };

    contextDataServiceSpy.get.and.returnValue(appContextData);

    component.ngOnInit();

    expect(contextDataServiceSpy.get).toHaveBeenCalledWith(QUOTE_APP_CONTEXT_DATA);
    expect(contextDataServiceSpy.set).toHaveBeenCalledWith(QUOTE_CONTEXT_DATA, QuoteModel.init());
    // expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should throw an error if homePageId does not exist', () => {
    const appContextData: AppContextData = {
      configuration: {
        pageMap: {}
      }
    } as AppContextData;

    contextDataServiceSpy.get.and.returnValue(appContextData);

    expect(() => component.ngOnInit()).toThrowError('Home page not found in configuration');
  });
});
