import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QuoteTrackDirective } from '../quote-track.directive';
import { TrackEventType } from '../quote-track.model';
import { QuoteTrackService } from '../quote-track.service';

@Component({
  template: `<div [nxTrack]="trackInfo" [nxTrackEvents]="trackEvents"></div>`
})
class TestComponent {
  trackInfo = { id: 'test-id' };
  trackEvents: TrackEventType[] = ['click', 'keyup'];
}

describe('QuoteTrackDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let trackService: jasmine.SpyObj<QuoteTrackService>;

  beforeEach(() => {
    trackService = jasmine.createSpyObj('QuoteTrackService', ['trackEvent']);

    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [QuoteTrackDirective],
      providers: [{ provide: QuoteTrackService, useValue: trackService }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directiveEl = fixture.debugElement.query(By.directive(QuoteTrackDirective));
    expect(directiveEl).toBeTruthy();
  });

  it('should listen to specified events and call trackEvent', () => {
    const directiveEl = fixture.debugElement.query(By.directive(QuoteTrackDirective));
    const divEl = directiveEl.nativeElement;

    divEl.dispatchEvent(new Event('click'));
    divEl.dispatchEvent(new Event('keyup'));

    expect(trackService.trackEvent).toHaveBeenCalledWith(
      'click',
      jasmine.objectContaining({ id: 'test-id', event: 'div_click', action: 'click' })
    );
    expect(trackService.trackEvent).toHaveBeenCalledWith(
      'keyup',
      jasmine.objectContaining({ id: 'test-id', event: 'div_keyup', action: 'keyup' })
    );
  });

  it('should not call trackEvent for unspecified events', () => {
    const directiveEl = fixture.debugElement.query(By.directive(QuoteTrackDirective));
    const divEl = directiveEl.nativeElement;

    divEl.dispatchEvent(new Event('keydown'));

    expect(trackService.trackEvent).not.toHaveBeenCalledWith('keydown', jasmine.anything());
  });
});
