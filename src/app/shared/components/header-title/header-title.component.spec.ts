import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { HeaderTitleComponent } from './header-title.component';

describe('HeaderTitleComponent', () => {
  let component: HeaderTitleComponent;
  let fixture: ComponentFixture<HeaderTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [HeaderTitleComponent, CommonModule, NxHeadlineModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct selector', () => {
    expect(fixture.debugElement.query(By.css('.quote__header'))).toBeTruthy();
  });

  it('should render the template', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('h3')).toBeTruthy();
  });
});
