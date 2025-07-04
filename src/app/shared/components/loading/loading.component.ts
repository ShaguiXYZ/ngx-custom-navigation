import { ComponentType } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { LoadingService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'quote-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule, NxModalModule]
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
