import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { QuoteBreadcrumbComponent, QuoteFooterComponent, QuoteLoadingComponent } from './shared/components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, NxGridModule, NxLinkModule, QuoteBreadcrumbComponent, QuoteFooterComponent, QuoteLoadingComponent]
})
export class AppComponent {}
