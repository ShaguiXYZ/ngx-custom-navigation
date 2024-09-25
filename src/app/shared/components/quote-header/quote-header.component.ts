import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { Page } from 'src/app/core/models';
import { RoutingService } from 'src/app/core/services';

@Component({
  selector: 'quote-header',
  standalone: true,
  imports: [CommonModule, NxLinkModule, NxIconModule],
  templateUrl: './quote-header.component.html',
  styleUrl: './quote-header.component.scss'
})
export class QuoteHeaderComponent {
  public showBackButton = true;
  private currentPage: Page | undefined;

  constructor(private _router: Router, private routingService: RoutingService, private _location: Location) {
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // this.currentPage = this.routingService.getPage(event.urlAfterRedirects);
        this.showBackButton = this.currentPage && this.currentPage.showBack === false ? false : true;
      }
    });
  }

  public navigateToContactUs() {
    this._router.navigate(['/contact-us']);
  }

  public return() {
    this.routingService.previousStep();
  }
}
