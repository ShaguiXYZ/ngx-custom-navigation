import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective, TrackInfo } from 'src/app/core/tracking';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'quote-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    SelectableOptionComponent,
    NxButtonModule,
    QuoteLiteralDirective,
    QuoteTrackDirective,
    QuoteLiteralPipe
  ]
})
export class IsPolicyOwnerComponent extends QuoteComponent {
  private readonly routingService = inject(RoutingService);

  public override canDeactivate = (): boolean => this.isValidData();

  public onIsPolicyOwnerChange(value: boolean): void {
    this._contextData.client.isPolicyOwner = value;
    this.routingService.next();
  }

  public get isPolicyOwner(): boolean | undefined {
    return this._contextData.client.isPolicyOwner;
  }

  private isValidData = (): boolean => hasValue(this._contextData.client.isPolicyOwner);
}
