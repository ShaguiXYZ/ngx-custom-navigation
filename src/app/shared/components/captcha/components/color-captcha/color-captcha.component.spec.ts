/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorCaptchaComponent } from './color-captcha.component';

describe('ColorCaptchaComponent', () => {
  let component: ColorCaptchaComponent;
  let fixture: ComponentFixture<ColorCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

  it('should initialize captcha on init', () => {
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

  it('should generate random style with rotation', () => {
    const style = component.getRandomStyle();
    expect(style.transform).toMatch(/rotate\(-?\d+deg\)/);
  });

  it('should emit uiVerified as true when correct items are selected', () => {
    component.coloredIndices = [1, 2, 3];
    (component as any).selectableItems = 3;
    spyOn(component.uiVerified, 'emit');

    component.onCharacterClick(1);
    component.onCharacterClick(2);
    component.onCharacterClick(3);

    expect(component.uiVerified.emit).toHaveBeenCalledWith(true);
  });

  it('should emit uiVerified as false when incorrect items are selected', () => {
    component.coloredIndices = [1, 2, 3];
    (component as any).selectableItems = 3;
    spyOn(component.uiVerified, 'emit');

    component.onCharacterClick(1);
    component.onCharacterClick(4);

    expect(component.uiVerified.emit).toHaveBeenCalledWith(false);
  });

  it('should reset selectedIndices if a non-colored index is clicked', () => {
    component.coloredIndices = [1, 2, 3];
    component.selectedIndices = [1, 2];
    component.onCharacterClick(4);
    expect(component.selectedIndices.length).toBe(0);
  });

  it('should generate captcha with correct number of items', () => {
    (component as any).generateCaptcha();
    expect(component.captchaImageIndexes.length).toBe((component as any).totalItems);
    expect(component.coloredIndices.length).toBe((component as any).selectableItems);
  });
});
