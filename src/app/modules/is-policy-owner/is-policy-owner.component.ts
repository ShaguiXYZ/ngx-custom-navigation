import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { ContextDataService, hasValue } from '@shagui/ng-shagui/core';
import { Observable } from 'rxjs';
import { QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { RoutingService } from 'src/app/core/services';
import { HeaderTitleComponent, SelectableOptionComponent } from 'src/app/shared/components';
import { QuoteLiteralDirective } from 'src/app/shared/directives';
import { IsValidData } from 'src/app/shared/guards';
import { QuoteModel } from 'src/app/shared/models';

@Component({
  selector: 'app-is-policy-owner',
  templateUrl: './is-policy-owner.component.html',
  styleUrl: './is-policy-owner.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective]
})
export class IsPolicyOwnerComponent implements OnInit, IsValidData {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public onIsPolicyOwnerChange(value: boolean): void {
    this.contextData.client.isPolicyOwner = value;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  public get isPolicyOwner(): boolean | undefined {
    return this.contextData.client.isPolicyOwner;
  }

  private isValidData = (): boolean => hasValue(this.contextData.client.isPolicyOwner);
}
