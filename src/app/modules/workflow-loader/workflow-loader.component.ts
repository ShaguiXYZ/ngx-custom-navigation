/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QuoteComponent } from 'src/app/core/components';
import { NX_WORKFLOW_TOKEN } from 'src/app/core/components/constants';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData } from 'src/app/core/models';

@Component({
  selector: 'quote-workflow-loader',
  template: `<ng-template #dynamicComponent></ng-template>`,
  standalone: true,
  imports: []
})
export class WorkflowLoaderComponent implements OnInit {
  public _instance?: QuoteComponent<any>;

  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly workflowToken = inject(NX_WORKFLOW_TOKEN);
  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    this.loadComponent();
  }

  private loadComponent = (): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (lastPage) {
      const manifestKey = lastPage.component ?? lastPage.pageId;

      try {
        const manifest = this.workflowToken.manifest.components[manifestKey];

        this.container.clear();
        const componentRef = this.container.createComponent<QuoteComponent<any>>(manifest.component);

        this._instance = componentRef.instance;

        window.history.pushState({}, '', lastPage.routeTree ?? lastPage.pageId);
      } catch {
        throw new JourneyError(`Failed to load component ${manifestKey} avalilable values are ${Object.keys(this.workflowToken.manifest)}`);
      }
    } else {
      throw new JourneyError('No last page found in context data');
    }
  };
}
