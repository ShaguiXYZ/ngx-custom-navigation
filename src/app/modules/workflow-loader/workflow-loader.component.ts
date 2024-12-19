import { Component, OnInit, ViewChild, ViewContainerRef, inject } from '@angular/core';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { QUOTE_APP_CONTEXT_DATA } from 'src/app/core/constants';
import { AppContextData, QuoteComponent } from 'src/app/core/models';
import { LIBRARY_MANIFEST } from 'src/app/library/library-manifest';

@Component({
  selector: 'quote-workflow-loader',
  templateUrl: './workflow-loader.component.html',
  styleUrls: ['./workflow-loader.component.scss'],
  standalone: true,
  imports: []
})
export class WorkflowLoaderComponent implements OnInit {
  protected _instance?: QuoteComponent;

  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true })
  private container!: ViewContainerRef;

  private readonly contextDataService = inject(ContextDataService);

  ngOnInit(): void {
    this.loadComponent();
  }

  private loadComponent = (): void => {
    const {
      configuration: { homePageId },
      navigation: { lastPage }
    } = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA);

    if (lastPage?.component) {
      const manifestKey = lastPage.component;
      const manifest = LIBRARY_MANIFEST[manifestKey];

      this.container.clear();
      const componentRef = this.container.createComponent(manifest.component);

      this._instance = componentRef.instance as QuoteComponent;

      window.history.pushState({}, '', lastPage.routeTree ?? lastPage.pageId);
    }
  };
}
