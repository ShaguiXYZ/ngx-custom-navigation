import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CAPTCHA_IMAGES } from './constants/captcha-images';
import { TTL } from '@shagui/ng-shagui/core';

@Component({
  selector: 'quote-color-captcha',
  templateUrl: './color-captcha.component.html',
  styleUrls: ['./color-captcha.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ColorCaptchaComponent implements OnInit, OnDestroy {
  public readonly images = CAPTCHA_IMAGES;

  public captchaImageIndexes: number[] = [];
  public coloredIndices: number[] = [];
  public selectedIndices: number[] = [];
  public timeToRefresh = 15;
  public timer!: number;

  @Output()
  public uiVerified: EventEmitter<boolean> = new EventEmitter<boolean>();

  private rotationDeg = 45;
  private totalItems = 9;
  private selectableItems = 0;

  private intervalId?: NodeJS.Timeout;

  ngOnInit(): void {
    this.timer = this.timeToRefresh;

    this.generateCaptcha();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  public getRandomStyle(): { transform: string } {
    const rotation = Math.floor(Math.random() * (this.rotationDeg * 2 + 1)) - this.rotationDeg; // Rotation between -{{rotationDeg}}deg and {{rotationDeg}}deg

    return {
      transform: `rotate(${rotation}deg)`
    };
  }

  public onCharacterClick(index: number): void {
    if (this.coloredIndices.includes(index)) {
      if (this.selectedIndices.includes(index)) {
        this.selectedIndices = this.selectedIndices.filter(i => i !== index);
      } else {
        this.selectedIndices.push(index);
      }
    } else {
      this.selectedIndices = [];
    }

    // Verify if the user has selected the selectableItems correct characters
    this.uiVerified.emit(
      this.selectedIndices.length === this.selectableItems && this.selectedIndices.every(i => this.coloredIndices.includes(i))
    );
  }

  private startTimer(): void {
    clearInterval(this.intervalId); // Ensure there are no previous timers

    this.intervalId = setInterval(() => {
      this.timer--;

      if (this.timer === 0) {
        this.generateCaptcha();
        this.timer = this.timeToRefresh;
      }
    }, TTL.seconds(1));
  }

  private generateCaptcha(): void {
    this.selectableItems = Math.floor(Math.random() * 4) + 3;
    this.captchaImageIndexes = [];
    this.coloredIndices = [];
    this.selectedIndices = [];

    // Generate n random letters
    for (let i = 0; i < this.totalItems; i++) {
      this.captchaImageIndexes.push(Math.floor(Math.random() * this.images.length));
    }

    // Select selectableItems random letters and change their color
    while (this.coloredIndices.length < this.selectableItems) {
      const index = Math.floor(Math.random() * this.totalItems);

      if (!this.coloredIndices.includes(index)) {
        this.coloredIndices.push(index);
      }
    }
  }
}
