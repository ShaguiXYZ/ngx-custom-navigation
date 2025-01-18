import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { RoutingService } from 'src/app/core/services';
import { QuoteTrackDirective } from 'src/app/core/tracking';
import { QuoteModel } from 'src/app/library/models';
import { HeaderTitleComponent, QuoteFooterComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { QuoteLiteralPipe } from 'src/app/shared/pipes';

@Component({
    selector: 'quote-is-policy-owner',
    templateUrl: './is-policy-owner.component.html',
    styleUrl: './is-policy-owner.component.scss',
    imports: [
        CommonModule,
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
