import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { QuoteFooterComponent, QuoteLoadingComponent } from './shared/components';
import { QuoteHeaderComponent } from './shared/components/quote-header';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, NxGridModule, NxLinkModule, QuoteFooterComponent, QuoteHeaderComponent, QuoteLoadingComponent]
})
export class AppComponent {}
