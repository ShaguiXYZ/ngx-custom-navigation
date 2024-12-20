import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteComponent } from '../../_quote-component';

@Component({
  selector: 'quote-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective, QuoteTrackDirective]
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
