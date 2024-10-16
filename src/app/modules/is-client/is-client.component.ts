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
  selector: 'app-is-client',
  templateUrl: './is-client.component.html',
  styleUrl: './is-client.component.scss',
  standalone: true,
  imports: [CommonModule, HeaderTitleComponent, SelectableOptionComponent, NxButtonModule, QuoteLiteralDirective]
})
export class IsClientComponent implements OnInit, IsValidData {
  private readonly contextDataService = inject(ContextDataService);
  private readonly routingService = inject(RoutingService);

  private contextData!: QuoteModel;

  ngOnInit(): void {
    this.contextData = this.contextDataService.get<QuoteModel>(QUOTE_CONTEXT_DATA);
  }

  public onIsClientChange(value: boolean): void {
    this.contextData.client.isClient = value;
    this.contextDataService.set(QUOTE_CONTEXT_DATA, this.contextData);

    this.routingService.nextStep();
  }

  public canDeactivate = (): boolean | Observable<boolean> | Promise<boolean> => this.isValidData();

  public get isClient(): boolean | undefined {
    return this.contextData.client.isClient;
  }

  private isValidData = (): boolean => hasValue(this.contextData.client.isClient);
}
