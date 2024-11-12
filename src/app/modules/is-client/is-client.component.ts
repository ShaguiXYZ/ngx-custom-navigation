import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { hasValue } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, QuoteBudgetComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';

@Component({
  selector: 'quote-is-client',
  templateUrl: './is-client.component.html',
  styleUrl: './is-client.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, QuoteBudgetComponent, NxButtonModule, QuoteLiteralDirective]
})
export class IsClientComponent extends QuoteComponent {
  private readonly routingService = inject(RoutingService);

  public onIsClientChange(value: boolean): void {
    this.contextData.client.isClient = value;
    this.populateContextData();

    this.routingService.next();
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public get isClient(): boolean | undefined {
    return this.contextData.client.isClient;
  }

  private isValidData = (): boolean => hasValue(this.contextData.client.isClient);
}
