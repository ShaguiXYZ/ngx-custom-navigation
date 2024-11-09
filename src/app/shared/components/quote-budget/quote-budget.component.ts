import { Component } from '@angular/core';
import { BudgetService } from 'src/app/core/services';

@Component({
  selector: 'quote-budget',
  templateUrl: './quote-budget.component.html',
  styleUrls: ['./quote-budget.component.scss'],
  standalone: true,
  providers: [BudgetService]
})
export class QuoteBudgetComponent {
  title = 'angular-architecture';
}
