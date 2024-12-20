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
  selector: 'quote-currently-insured',
  templateUrl: './currently-insured.component.html',
  styleUrl: './currently-insured.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective, QuoteTrackDirective]
})
export class CurrentlyInsuredComponent extends QuoteComponent {
  private readonly routingService = inject(RoutingService);

  public onCurrentlyInsuredChange(value: boolean): void {
    this._contextData.client.isCurrentlyInsured = value;
    this.routingService.next();
  }

  public override canDeactivate = (): boolean => this.isValidData();

  public get isCurrentlyInsured(): boolean | undefined {
    return this._contextData.client.isCurrentlyInsured;
  }

  private isValidData = (): boolean => hasValue(this._contextData.client.isCurrentlyInsured);
}
