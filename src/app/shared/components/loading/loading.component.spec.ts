import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NxDialogService, NxModalModule } from '@aposin/ng-aquila/modal';
import { emptyFn, LoadingService } from '@shagui/ng-shagui/core';
import { NxDialogServiceMock } from 'src/app/core/mock/services/dialog-service.mock';
import { LoadingServiceMock } from 'src/app/core/mock/services/loading-service.mock';
import { QuoteLoadingComponent } from './loading.component';

describe('QuoteLoadingComponent', () => {
  let component: QuoteLoadingComponent;
  let fixture: ComponentFixture<QuoteLoadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [QuoteLoadingComponent, NxModalModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: LoadingService, useClass: LoadingServiceMock },
        { provide: NxDialogService, useClass: NxDialogServiceMock }
      ]
    })
      .compileComponents()
      .catch(emptyFn);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the sdc loading component', () => {
    expect(component).toBeTruthy();
  });
});
