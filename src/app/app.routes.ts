import { Routes } from '@angular/router';
import { configContextRoutes } from '@shagui/ng-shagui/core';
import { AppUrls } from './shared/config';
import { canDeactivateGuard, journeyGuard } from './shared/guards';

export const routes: Routes = configContextRoutes([
  {
    path: AppUrls.home,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: `${AppUrls._dispatcher}/:dispatcher`,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: `${AppUrls._stored}/:stored`,
    loadComponent: () => import('./modules/quote-dispatcher/quote-dispatcher.component').then(c => c.QuoteDispatcherComponent)
  },
  {
    path: AppUrls._loader,
    loadComponent: () => import('./modules/workflow-loader/workflow-loader.component').then(c => c.WorkflowLoaderComponent),
    canActivate: [journeyGuard],
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: AppUrls.root,
    pathMatch: 'full',
    redirectTo: AppUrls.home
  }
]);
