import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorCaptchaComponent } from './color-captcha.component';

describe('ColorCaptchaComponent', () => {
  let component: ColorCaptchaComponent;
  let fixture: ComponentFixture<ColorCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ColorCaptchaComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate captcha on init', () => {
    spyOn(component as any, 'generateCaptcha');
    component.ngOnInit();
    expect((component as any).generateCaptcha).toHaveBeenCalled();
  });

  it('should start timer on init', () => {
    spyOn(component as any, 'startTimer');
    component.ngOnInit();
    expect((component as any).startTimer).toHaveBeenCalled();
  });

  it('should clear interval on destroy', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(clearInterval).toHaveBeenCalledWith((component as any).intervalId);
  });

  it('should generate a captcha with 8 characters', () => {
    (component as any).generateCaptcha();
    expect(component.captchaImageIndexes.length).toBe(8);
  });

  it('should generate a captcha with 3 colored indices', () => {
    (component as any).generateCaptcha();
    expect(component.coloredIndices.length).toBe(3);
  });

  it('should emit uiVerified as true when 3 correct characters are selected', () => {
    spyOn(component.uiVerified, 'emit');
    component.coloredIndices = [0, 1, 2];
    component.onCharacterClick(0);
    component.onCharacterClick(1);
    component.onCharacterClick(2);
    expect(component.uiVerified.emit).toHaveBeenCalledWith(true);
  });

  it('should emit uiVerified as false when less than 3 characters are selected', () => {
    spyOn(component.uiVerified, 'emit');
    component.coloredIndices = [0, 1, 2];
    component.onCharacterClick(0);
    component.onCharacterClick(1);
    expect(component.uiVerified.emit).toHaveBeenCalledWith(false);
  });

  it('should reset selectedIndices if a non-colored character is clicked', () => {
    component.coloredIndices = [0, 1, 2];
    component.onCharacterClick(3);
    expect(component.selectedIndices.length).toBe(0);
  });

  it('should toggle selection of a colored character', () => {
    component.coloredIndices = [0, 1, 2];
    component.onCharacterClick(0);
    expect(component.selectedIndices).toContain(0);
    component.onCharacterClick(0);
    expect(component.selectedIndices).not.toContain(0);
  });
});
