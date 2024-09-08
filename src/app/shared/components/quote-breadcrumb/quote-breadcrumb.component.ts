import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { NxBreadcrumbModule } from '@aposin/ng-aquila/breadcrumb';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { ContextDataService } from '@shagui/ng-shagui/core';
import { filter } from 'rxjs';
import { QUOTE_APP_CONTEXT_DATA_NAME } from 'src/app/core/constants';
import { AppContextData } from 'src/app/core/models';
import { PageModel } from '../../models/page.model';

@Component({
  selector: 'quote-breadcrumb',
  standalone: true,
  imports: [CommonModule, NxBreadcrumbModule, NxButtonModule, RouterLink, NxIconModule],
  templateUrl: './quote-breadcrumb.component.html',
  styleUrl: './quote-breadcrumb.component.scss'
})
export class QuoteBreadcrumbComponent implements AfterViewInit {
  public pagesSeenForBreadcrumb: PageModel[] = [];
  public showButtons: boolean = false;

  @ViewChild('breadcrumb') breadcrumbChild: ElementRef<HTMLDivElement> | undefined;

  private breadcrumbNativeElement: HTMLDivElement | undefined;

  constructor(private router: Router, private contextDataService: ContextDataService) {
    this.fillPagesArray();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.fillPagesArray();
      setTimeout(() => {
        this.scrollMaxRight();
        this.showButtons =
          !!this.breadcrumbNativeElement && this.breadcrumbNativeElement.scrollWidth > this.breadcrumbNativeElement.clientWidth;
      }, 10);
    });
  }

  ngAfterViewInit(): void {
    this.breadcrumbNativeElement = this.breadcrumbChild?.nativeElement;
  }

  public scrollMaxLeft(): void {
    this.breadcrumbNativeElement?.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  }

  public scrollMaxRight(): void {
    this.breadcrumbNativeElement?.scrollTo({
      left: this.breadcrumbNativeElement.scrollLeft + this.breadcrumbNativeElement.scrollWidth,
      behavior: 'smooth'
    });
  }

  public scrollRight(): void {
    this.breadcrumbNativeElement?.scrollTo({
      left: this.breadcrumbNativeElement.scrollLeft + 150,
      behavior: 'smooth'
    });
  }

  public scrollLeft(): void {
    this.breadcrumbNativeElement?.scrollTo({
      left: this.breadcrumbNativeElement?.scrollLeft - 150,
      behavior: 'smooth'
    });
  }

  private fillPagesArray(): void {
    const pagesSeen = this.contextDataService.get<AppContextData>(QUOTE_APP_CONTEXT_DATA_NAME)?.viewedPages || [];

    this.pagesSeenForBreadcrumb = pagesSeen.filter(page => page.showAsBreadcrumb);

    if (pagesSeen.at(-1)?.id !== this.pagesSeenForBreadcrumb.at(-1)?.id) {
      this.pagesSeenForBreadcrumb.push(pagesSeen.at(-1)!);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.showButtons =
      !!this.breadcrumbNativeElement && this.breadcrumbNativeElement.scrollWidth > this.breadcrumbNativeElement.clientWidth;
    if (this.showButtons) {
      this.scrollMaxRight();
    }
  }
}
