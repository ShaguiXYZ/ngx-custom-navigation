import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NxTooltipModule } from '@aposin/ng-aquila/tooltip';
import { Subscription } from 'rxjs';
import { RoutingService } from 'src/app/core/services';
import { Step, Stepper } from '../../models/stepper.model';
import { QuoteStepperService } from './services';
import { NxIconModule } from '@aposin/ng-aquila/icon';

@Component({
  selector: 'quote-stepper',
  standalone: true,
  imports: [CommonModule, NxIconModule, NxTooltipModule],
  templateUrl: './quote-stepper.component.html',
  styleUrls: ['./quote-stepper.component.scss'],
  providers: [QuoteStepperService]
})
export class QuoteStepperComponent implements OnInit, OnDestroy {
  public stepperData?: { stepper: Stepper; stepKey: string };
  public stepperIndex = 0;

  private subscription$: Subscription[] = [];

  private quoteStepperService = inject(QuoteStepperService);
  private routingService = inject(RoutingService);

  ngOnInit(): void {
    this.subscription$.push(
      this.quoteStepperService.asObservable().subscribe(data => {
        this.stepperData = data;
        this.stepperIndex = data?.stepper.steps.findIndex(step => step.key === data.stepKey) ?? 0;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public onStepClick(step: Step): void {
    this.routingService.goToStep(step.url);
  }
}
