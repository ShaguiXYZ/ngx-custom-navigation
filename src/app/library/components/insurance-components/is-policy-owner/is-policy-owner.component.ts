import { NxButtonModule } from '@allianz/ng-aquila/button';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from '../../../../core/components';
import { RoutingService } from '../../../../core/services';
import { QuoteTrackDirective } from '../../../../core/tracking';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from '../../../../shared/components';
import { QuoteLiteralDirective } from '../../../../shared/directives';
import { QuoteLiteralPipe } from '../../../../shared/pipes';
import { QuoteModel } from '../../../models';

@Component({
  selector: 'quote-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    HeaderTitleComponent,
    QuoteFooterComponent,
    SelectableOptionComponent,
    NxButtonModule,
    QuoteLiteralPipe,
    QuoteLiteralDirective,
    QuoteTrackDirective
]
})
export class IsPolicyOwnerComponent extends QuoteComponent<QuoteModel> {
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
