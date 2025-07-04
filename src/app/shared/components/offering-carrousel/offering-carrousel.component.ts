import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, Renderer2, viewChild } from '@angular/core';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { QuoteError } from 'src/app/core/errors';
import { OfferingPriceModel } from 'src/app/core/models';
import { QuoteOfferingCoveragesComponent, QuoteOfferingPriceCardComponent } from './components';

@Component({
  selector: 'quote-offering-carrousel',
  templateUrl: './offering-carrousel.component.html',
  styleUrls: ['./offering-carrousel.component.scss'],
  imports: [CommonModule, QuoteOfferingPriceCardComponent, NxModalModule]
})
export class OfferingCarrouselComponent implements OnInit, OnDestroy {
  private readonly $inner = viewChild.required<ElementRef>('carrouselInner');
  private readonly $track = viewChild.required<ElementRef>('carrouselTrack');

  @Input()
  public selectedPriceIndex = 0;

  @Input()
  public prices: OfferingPriceModel[] = [];

  @Output()
  public uiSelected: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public uiCallNow: EventEmitter<number> = new EventEmitter<number>();

  @Output()
  public uiContactUs: EventEmitter<number> = new EventEmitter<number>();

  private componentDialogRef?: NxModalRef<QuoteOfferingCoveragesComponent>;
  private swipeCoord!: [number, number];
  private swipeTime!: number;
  private timeout?: NodeJS.Timeout;

  private readonly unlistenFns: (() => void)[] = [];

  private readonly renderer = inject(Renderer2);
  private readonly dialogService = inject(NxDialogService);

  ngOnInit(): void {
    try {
      this.timeout = setTimeout(
        () => this.prices.length && this.prices.length > this.selectedPriceIndex && this.selectSteper(this.selectedPriceIndex)
      );
    } catch {
      throw new QuoteError('Error fetching offering prices');
    }

    this.unlistenFns.push(
      this.renderer.listen(this.$track().nativeElement, 'touchstart', (event: TouchEvent) => this.swipeStart(event)),
      this.renderer.listen(this.$track().nativeElement, 'touchend', (event: TouchEvent) => this.swipeEnd(event))
    );
  }

  ngOnDestroy(): void {
    this.unlistenFns.forEach(unlisten => unlisten());
    clearTimeout(this.timeout);
  }

  public next(): void {
    this.selectSteper((this.selectedPriceIndex + 1) % this.prices.length);
  }

  public previous(): void {
    this.selectSteper((this.selectedPriceIndex - 1 + this.prices.length) % this.prices.length);
  }

  public showCoverages(index: number) {
    this.selectedPriceIndex = index;
    this.componentDialogRef?.close();
    this.componentDialogRef = this.openFromComponent(QuoteOfferingCoveragesComponent, {
      prices: this.prices,
      selectedPriceIndex: index
    });
  }

  public selectSteper(index: number): void {
    this.selectedPriceIndex = index;
    this.selectCarrouselCard();
    this.uiSelected.emit(index);
  }

  public callNow(index: number): void {
    this.uiCallNow.emit(index);
  }

  public contactUs(index: number): void {
    this.uiContactUs.emit(index);
  }

  private swipeStart(event: TouchEvent): void {
    this.swipeCoord = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    this.swipeTime = new Date().getTime();
  }

  private swipeEnd(event: TouchEvent): void {
    const coord = [event.changedTouches[0].clientX, event.changedTouches[0].clientY];
    const time = new Date().getTime();
    const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
    const duration = time - this.swipeTime;

    if (duration < 1500 && Math.abs(direction[0]) > 30 && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) {
      const trackIndex = (this.selectedPriceIndex + (direction[0] < 0 ? 1 : -1) + this.prices.length) % this.prices.length;
      this.selectSteper(trackIndex);
    }
  }

  private openFromComponent<T = unknown>(component: ComponentType<T>, data?: unknown): NxModalRef<T> {
    return this.dialogService.open(component, {
      maxWidth: '98%',
      showCloseIcon: true,
      data
    });
  }

  /**
   *  set the scroll position of the track to the selected price index
   *  with a smooth transition
   **/
  private selectCarrouselCard(): void {
    const innerWidth = this.$inner().nativeElement.clientWidth;
    const screenItems = Math.floor(innerWidth / this.$track().nativeElement.childNodes[0].clientWidth);
    const trackCards = this.prices.length - screenItems > this.selectedPriceIndex;
    const selectedCardLeftPosition = this.selectedCardLeftPosition(trackCards ? this.selectedPriceIndex : this.prices.length - screenItems);

    requestAnimationFrame(() => {
      this.renderer.setStyle(this.$track().nativeElement, 'transition', 'transform 0.5s ease-out');
      this.renderer.setStyle(this.$track().nativeElement, 'transform', `translateX(${-selectedCardLeftPosition}px)`);
    });
  }

  private selectedCardLeftPosition = (index: number): number =>
    Array.from(this.$track().nativeElement.childNodes as NodeList)
      .slice(0, index)
      .reduce<number>((acc, card) => acc + (card as HTMLElement).clientWidth, 0);
}
