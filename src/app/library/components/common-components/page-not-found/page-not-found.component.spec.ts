import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotfoundComponent } from './page-not-found.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PagenotfoundComponent', () => {
  let component: PageNotfoundComponent;
  let fixture: ComponentFixture<PageNotfoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [PageNotfoundComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Page Not Found');
  });
});
