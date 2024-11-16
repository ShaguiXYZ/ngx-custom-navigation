import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective, TrackInfo } from 'src/app/core/tracking';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective, QuoteTrackDirective]
})
export class IsPolicyOwnerComponent extends QuoteComponent {
  private readonly routingService = inject(RoutingService);

  public get trackInfo(): Partial<TrackInfo> {
    return {
      ...this._trackInfo,
      label: this.quoteLiteral.transform('footer-next'),
      title: this.quoteLiteral.transform('header'),
      isPolicyOwner: this._contextData.client.isPolicyOwner?.toString() || null
    };
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public onIsPolicyOwnerChange(value: boolean): void {
    this._contextData.client.isPolicyOwner = value;
    this.routingService.next(this._contextData);
  }

  public get isPolicyOwner(): boolean | undefined {
    return this._contextData.client.isPolicyOwner;
  }

  private isValidData = (): boolean => hasValue(this._contextData.client.isPolicyOwner);
}
