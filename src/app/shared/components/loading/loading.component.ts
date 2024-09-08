import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxDialogService, NxModalModule, NxModalRef } from '@aposin/ng-aquila/modal';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { LoadingService } from '@shagui/ng-shagui/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'quote-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule, NxModalModule, NxSpinnerModule],
  standalone: true
})
export class QuoteLoadingComponent implements OnInit, OnDestroy {
  @ViewChild('loadingBody') templateLoadingRef!: TemplateRef<any>;
  private templateLoadingDialogRef!: NxModalRef<any>;

  private loadingObs!: Subscription;

  private readonly loadingService = inject(LoadingService);

  constructor(private readonly dialogService: NxDialogService) {}

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
    this.templateLoadingDialogRef = this.dialogService.open(this.templateLoadingRef, {
      width: '200px',
      disableClose: true
    });
  }

  private closeLoadingModal(): void {
    this.templateLoadingDialogRef?.close();
  }
}
