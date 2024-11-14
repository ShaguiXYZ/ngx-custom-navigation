import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { ContextDataService, copyToClipboard, NotificationService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA, QUOTE_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteModel } from 'src/app/core/models';
import { BudgetService, RoutingService } from 'src/app/core/services';
import { QuoteLiteralDirective } from '../../directives';
import { QuoteLiteralPipe } from '../../pipes';
import { HeaderTitleComponent } from '../header-title';
import { SelectableOptionComponent } from '../selectable-option';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';

@Component({
  selector: 'quote-budget',
  templateUrl: './quote-budget.component.html',
  styleUrls: ['./quote-budget.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderTitleComponent,
    SelectableOptionComponent,
    NxButtonModule,
    NxCopytextModule,
    NxFormfieldModule,
    NxHeadlineModule,
    NxInputModule,
    NxTabsModule,
    ReactiveFormsModule,
    QuoteLiteralDirective,
    QuoteLiteralPipe
  ],
  providers: [BudgetService, QuoteLiteralPipe]
})
export class QuoteBudgetComponent implements OnInit {
  public form!: FormGroup;

  @Output()
  public budgetRestored: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public budgetStored: EventEmitter<void> = new EventEmitter<void>();

  private readonly budgetService = inject(BudgetService);
  private readonly contextDataService = inject(ContextDataService);
  private readonly notificationService = inject(NotificationService);
  private readonly routingService = inject(RoutingService);
  private readonly quoteLiteralPipe = inject(QuoteLiteralPipe);

  ngOnInit(): void {
    this.createForm();
  }

  public retrieveBudget(): void {
    const key = this.form.get('retrieveBudget')?.get('storePassKey')?.value;
    const budget = this.budgetService.retrieveBudget(key);

    if (!budget) {
      return;
    }

    this.contextDataService.set<AppContextData>(QUOTE_APP_CONTEXT_DATA, budget.context);
    this.contextDataService.set<QuoteModel>(QUOTE_CONTEXT_DATA, budget.quote);

    this.routingService.resetNavigation().then(() => {
      this.budgetRestored.emit();
    });
  }

  public storeBudget(): void {
    const storeName = this.form.get('storeBudget')?.get('storeName')?.value;

    this.copyToClipboard(this.budgetService.storeBudget(storeName)).then(() => {
      this.budgetStored.emit();
    });
  }

  private async copyToClipboard(value: string): Promise<void> {
    await copyToClipboard(value);

    this.notificationService.info(this.quoteLiteralPipe.transform('quote-copied-to-clipboard'), value);
  }

  private createForm(): void {
    this.form = new FormGroup({
      retrieveBudget: new FormGroup({
        storePassKey: new FormControl('', [Validators.required])
      }),
      storeBudget: new FormGroup({
        storeName: new FormControl('')
      })
    });
  }
}
