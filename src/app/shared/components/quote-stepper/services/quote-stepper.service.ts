import { inject, Injectable, OnDestroy } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { Stepper } from 'src/app/shared/models/stepper.model';

@Injectable()
export class QuoteStepperService implements OnDestroy {
  private subscription$: Subscription[] = [];

  private quoteSteps$ = new Subject<{ stepper: Stepper; stepKey: string } | undefined>();

  private readonly contextDataService = inject(ContextDataService);

  constructor() {
    this.subscription$.push(
      this.contextDataService.onDataChange<AppContextData>(QUOTE_APP_CONTEXT_DATA).subscribe(data => {
        const pageId = data.navigation.lastPage?.pageId;

        if (!pageId) {
          this.quoteSteps$.next(undefined);
          return;
        }

        const page = data.configuration.pageMap[pageId];

        if (!page?.stepper) {
          this.quoteSteps$.next(undefined);
          return;
        }

        const stepper = data.configuration.steppers?.steppersMap[page.stepper.key];
        const stepKey = page.stepper.stepKey;

        this.quoteSteps$.next(stepper ? { stepper, stepKey } : undefined);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.forEach(sub => sub.unsubscribe());
  }

  public asObservable(): Observable<{ stepper: Stepper; stepKey: string } | undefined> {
    return this.quoteSteps$.asObservable();
  }
}
