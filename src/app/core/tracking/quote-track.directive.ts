import { Directive, ElementRef, Input, OnInit, Renderer2, inject } from '@angular/core';
import { TrackEventType, TrackInfo } from './quote-track.model';
import { QuoteTrackService } from './quote-track.service';

@Directive({
  selector: '[nxTrack]',
  standalone: true
})
export class QuoteTrackDirective implements OnInit {
  @Input('nxTrack')
  public nxTrackInfo: TrackInfo = {};

  @Input()
  public nxTrackEvents!: Set<TrackEventType> | TrackEventType[];

  private readonly unlistenFns: (() => void)[] = [];
  private readonly trackService = inject(QuoteTrackService);

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.nxTrackEvents.forEach(event => {
      this.unlistenFns.push(this.renderer.listen(this.el.nativeElement, event, this.trackEvent(event)));
    });
  }

  // private applyCustomProperties(): void {
  //   Object.entries(this.nxTrackInfo).forEach(([key, value]) => {
  //     this.renderer.setAttribute(this.el.nativeElement, key, value);
  //   });
  // }

  private trackEvent =
    (eventType: TrackEventType): ((event: Event) => void) =>
    async (): Promise<void> => {
      const elementType = this.el.nativeElement.tagName.toLowerCase();

      await this.trackService.trackEvent(eventType, { ...this.nxTrackInfo, event: `${elementType}_${eventType}`, action: eventType });
    };
}
