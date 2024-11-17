import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, Step, Stepper } from 'src/app/core/models';
import { QuoteLiteralPipe } from '../../pipes';
import { QuoteStepperService } from './services';

@Component({
  selector: 'quote-stepper',
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.scss'],
  providers: [QuoteStepperService],
  imports: [CommonModule, NxCopytextModule, NxIconModule, NxTooltipModule, QuoteLiteralPipe],
  standalone: true
})
export class QuoteStepperComponent implements OnInit, OnDestroy {
  public stepperData?: { stepper: Stepper; stepKey: string };
  public stepperIndex = 0;
  public showLabel = true;
  public showSteps = true;

  private subscription$: Subscription[] = [];

  private readonly contextDataService = inject(ContextDataService);
  private readonly quoteStepperService = inject(QuoteStepperService);

  ngOnInit(): void {
    this.subscription$.push(
      this.quoteStepperService.asObservable().subscribe(data => {
        this.stepperData = data;
        this.stepperIndex = data?.stepper.steps.findIndex(step => step.key === data.stepKey) ?? 0;

        this.stepperProperties();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public onStepClick(step: Step): void {
    this.quoteStepperService.goToStep(step);
  }

  private stepperProperties = (): void => {
    const { navigation } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);
    const lastPage = navigation?.lastPage;
    const config: { label?: string; showLabel?: boolean; showSteps?: boolean } = lastPage?.configuration?.data?.['stepperConfig'] ?? {};

    if (this.stepperData && this.stepperData.stepper && config.label) {
      this.stepperData.stepper.steps[this.stepperIndex].label = config.label;
    }

    this.showLabel = config.showLabel ?? true;
    this.showSteps = config.showSteps ?? true;
  };
}
