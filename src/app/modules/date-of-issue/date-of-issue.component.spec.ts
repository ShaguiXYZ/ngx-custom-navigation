import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { ContextDataServiceMock, TranslateServiceMock } from 'src/app/core/mock/services';
import { DateOfIssueComponent } from './date-of-issue.component';

describe('DateOfIssueComponent', () => {
  let component: DateOfIssueComponent;
  let fixture: ComponentFixture<DateOfIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateOfIssueComponent],
      providers: [
        provideHttpClient(),
        { provide: ContextDataService, useClass: ContextDataServiceMock },
        { provide: TranslateService, useClass: TranslateServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DateOfIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
