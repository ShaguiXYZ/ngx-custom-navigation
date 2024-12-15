import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'quote-color-captcha',
  templateUrl: './color-captcha.component.html',
  styleUrls: ['./color-captcha.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class ColorCaptchaComponent implements OnInit, OnDestroy {
  public captchaText: string[] = [];
  public coloredIndices: number[] = [];
  public selectedIndices: number[] = [];
  public timeToRefresh = 15;
  public timer!: number;

  private rotationDeg = 45;

  @Output()
  public uiVerified: EventEmitter<boolean> = new EventEmitter<boolean>();

  private intervalId: any;

  ngOnInit(): void {
    this.timer = this.timeToRefresh;

    this.generateCaptcha();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private startTimer(): void {
    clearInterval(this.intervalId); // Ensure there are no previous timers

    this.intervalId = setInterval(() => {
      this.timer--;

      if (this.timer === 0) {
        this.generateCaptcha();
        this.timer = this.timeToRefresh;
      }
    }, 1000);
  }

  public getRandomStyle(): any {
    const rotation = Math.floor(Math.random() * (this.rotationDeg * 2 + 1)) - this.rotationDeg; // Rotation between -45deg and 45deg

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

    // Verify if the user has selected the 3 correct characters
    this.uiVerified.emit(this.selectedIndices.length === 3 && this.selectedIndices.every(i => this.coloredIndices.includes(i)));
  }

  private generateCaptcha(): void {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#@?%';
    this.captchaText = [];
    this.coloredIndices = [];
    this.selectedIndices = [];

    // Generate 8 random letters
    for (let i = 0; i < 8; i++) {
      this.captchaText.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    }

    // Select 3 random letters and change their color
    while (this.coloredIndices.length < 3) {
      const index = Math.floor(Math.random() * 8);

      if (!this.coloredIndices.includes(index)) {
        this.coloredIndices.push(index);
      }
    }
  }
}
