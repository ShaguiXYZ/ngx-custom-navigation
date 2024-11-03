import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective]
})
export class IsPolicyOwnerComponent extends QuoteComponent {
  private readonly routingService = inject(RoutingService);

  public override canDeactivate = (): boolean => this.isValidData();

  public onIsPolicyOwnerChange(value: boolean): void {
    this.contextData.client.isPolicyOwner = value;
    this.populateContextData();

    this.routingService.nextStep();
  }

  public get isPolicyOwner(): boolean | undefined {
    return this.contextData.client.isPolicyOwner;
  }

  private isValidData = (): boolean => hasValue(this.contextData.client.isPolicyOwner);
}
