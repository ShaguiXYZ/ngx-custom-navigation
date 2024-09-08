import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';

@Component({
  selector: 'quote-header-title',
  standalone: true,
  imports: [CommonModule, NxHeadlineModule],
  templateUrl: './header-title.component.html',
  styleUrl: './header-title.component.scss'
})
export class HeaderTitleComponent {}
