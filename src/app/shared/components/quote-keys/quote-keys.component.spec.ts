/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NxDialogService, NxModalModule } from '@aposin/ng-aquila/modal';
import { ScreenRecorder } from '@shagui/ng-shagui/core';
import { QuoteKeysComponent } from './quote-keys.component';

describe('QuoteKeysComponent', () => {
  let component: QuoteKeysComponent;
  let fixture: ComponentFixture<QuoteKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [QuoteKeysComponent, CommonModule, NxModalModule],
      providers: [NxDialogService]
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start screen recording on Ctrl+R', () => {
    spyOn(ScreenRecorder, 'startRecording');
    const event = new KeyboardEvent('keydown', { key: 'R', ctrlKey: true });

    document.dispatchEvent(event);

    expect(ScreenRecorder.startRecording).toHaveBeenCalled();
  });

  it('should prevent default action for Ctrl+K', () => {
    const event = new KeyboardEvent('keydown', { key: 'K', ctrlKey: true });
    spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle Mac key events', () => {
    spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('Macintosh');
    spyOn(component as any, 'eventCtrlKeyActions');
    const event = new KeyboardEvent('keydown', { key: 'P', metaKey: true });

    document.dispatchEvent(event);

    expect((component as any).eventCtrlKeyActions).toHaveBeenCalledWith(event);
  });

  it('should handle Windows key events', () => {
    spyOn(component as any, 'eventCtrlKeyActions');
    const event = new KeyboardEvent('keydown', { key: 'P', ctrlKey: true });

    document.dispatchEvent(event);

    expect((component as any).eventCtrlKeyActions).toHaveBeenCalledWith(event);
  });

  it('should handle Escape key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent default action for F1 key', () => {
    const event = new KeyboardEvent('keydown', { key: 'F1' });
    spyOn(event, 'preventDefault');

    document.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
