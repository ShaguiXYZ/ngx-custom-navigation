import { inject, Injectable, OnDestroy } from '@angular/core';
import { NxDatepickerIntl } from '@aposin/ng-aquila/datefield';
import { Subscription } from 'rxjs';
import { LiteralsService } from 'src/app/core/services';

@Injectable()
export class DatePikerIntl extends NxDatepickerIntl implements OnDestroy {
  private readonly literalSubscription: Subscription;
  private readonly literalsService = inject(LiteralsService);

  constructor() {
    super();

    this.literalSubscription = this.literalsService.onLanguageChange().subscribe(() => {
      this.switchToMonthViewLabel = this.literalsService.toString({
        value: 'Label.Datepicker.SwitchToMonthView',
        type: 'translate'
      });

      this.switchToMultiYearViewLabel = this.literalsService.toString({
        value: 'Label.Datepicker.SwitchToMultiYearViewLabel',
        type: 'translate'
      });
    });
  }

  ngOnDestroy(): void {
    this.literalSubscription.unsubscribe();
  }

  override switchToMonthViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMonthView',
    type: 'translate'
  });
  override switchToMultiYearViewLabel = this.literalsService.toString({
    value: 'Label.Datepicker.SwitchToMultiYearViewLabel',
    type: 'translate'
  });
}
