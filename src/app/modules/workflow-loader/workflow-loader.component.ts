import { Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { JourneyError } from 'src/app/core/errors';
import { AppContextData } from 'src/app/core/models';
import { QuoteComponent } from 'src/app/library';
import { LIBRARY_MANIFEST, WorkflowComponent } from 'src/app/library/library-manifest';

@Component({
  selector: 'quote-workflow-loader',
  template: `<ng-template #dynamicComponent></ng-template>`,
  styleUrls: ['./workflow-loader.component.scss'],
  standalone: true,
  imports: []
})
export class WorkflowLoaderComponent implements OnInit {
  public _instance?: QuoteComponent;

  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    this.loadComponent();
  }

  private loadComponent = (): void => {
    const {
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (lastPage) {
      const manifestKey = lastPage.component ?? (lastPage.pageId as WorkflowComponent);

      try {
        const manifest = LIBRARY_MANIFEST[manifestKey];

        this.container.clear();
        const componentRef = this.container.createComponent(manifest.component);

        this._instance = componentRef.instance as QuoteComponent;

        window.history.pushState({}, '', lastPage.routeTree ?? lastPage.pageId);
      } catch {
        throw new JourneyError(`Failed to load component ${manifestKey} avalilable values are ${Object.keys(LIBRARY_MANIFEST)}`);
      }
    } else {
      throw new JourneyError('No last page found in context data');
    }
  };
}
