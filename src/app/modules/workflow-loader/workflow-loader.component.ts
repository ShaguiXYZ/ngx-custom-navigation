/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ContextDataService, LoadingService } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/models';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData } from 'src/app/core/models';

@Component({
  template: `<ng-template #dynamicComponent> </ng-template>`,
  styleUrls: ['./workflow-loader.component.scss'],
  imports: [CommonModule]
})
export class WorkflowLoaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  public _instance?: QuoteComponent<any>;

  private readonly workflowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);
  private readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    this.loadComponent();
  }

  ngOnDestroy(): void {
    this.loadingService.showLoading = true;
  }

  ngAfterViewInit(): void {
    this.loadingService.showLoading = false;
  }

  private loadComponent = (): void => {
    const lastPage = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA)?.navigation?.lastPage;

    if (!lastPage) {
      throw new JourneyError('No last page found in context data');
    }

    const manifestKey = lastPage.component ?? lastPage.pageId;
    const manifest = this.workflowToken.manifest.components[manifestKey];

    if (!manifest) {
      throw new JourneyError(
        `Failed to load component ${manifestKey} available values are ${Object.keys(this.workflowToken.manifest.components)}`
      );
    }

    try {
      this.container.clear();
      const componentRef = this.container.createComponent<QuoteComponent<any>>(manifest.component);
      this._instance = componentRef.instance;
      window.history.pushState({}, '', lastPage.routeTree ?? lastPage.pageId);
    } catch {
      throw new JourneyError(`Failed to load component ${manifestKey}`);
    }
  };
}
