import { NxButtonModule } from '@allianz/ng-aquila/button';
import { CommonModule } from '@angular/common';
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
  selector: 'quote-currently-insured',
  templateUrl: './currently-insured.component.html',
  styleUrl: './currently-insured.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
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
export class CurrentlyInsuredComponent extends QuoteComponent<QuoteModel> {
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
