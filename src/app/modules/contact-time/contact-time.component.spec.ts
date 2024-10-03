import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTimeComponent } from './contact-time.component';

describe('ContactTimeComponent', () => {
  let component: ContactTimeComponent;
  let fixture: ComponentFixture<ContactTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
