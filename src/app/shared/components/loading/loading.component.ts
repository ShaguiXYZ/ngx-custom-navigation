import { ComponentType } from '@angular/cdk/portal';

import { NxDialogService, NxModalModule, NxModalRef } from '@allianz/ng-aquila/modal';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { LoadingService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'quote-loading',
  template: `
    <ng-template #loadingBody>
      <div class="center">
        <div class="loader" role="status"></div>
      </div>
    </ng-template>
  `,
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NxModalModule]
})
export class QuoteLoadingComponent implements OnInit, OnDestroy {
  private templateLoadingDialogRef?: NxModalRef<unknown>;
  private loadingObs!: Subscription;

  private readonly $templateLoadingRef = viewChild.required<ComponentType<unknown>>('loadingBody');
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(NxDialogService);

  ngOnInit(): void {
    this.loadingObs = this.loadingService.asObservable().subscribe((show: boolean) => {
      if (show) {
        this.openLoadingModal();
      } else {
        this.closeLoadingModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.loadingObs.unsubscribe();
  }

  private openLoadingModal(): void {
    this.templateLoadingDialogRef = this.dialogService.open(this.$templateLoadingRef(), {
      width: '200px',
      disableClose: true
    });
  }

  private closeLoadingModal(): void {
    this.templateLoadingDialogRef?.close();
  }
}
