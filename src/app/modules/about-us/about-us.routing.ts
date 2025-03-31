import {Route, Routes} from '@angular/router';

export const AboutUsRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/about-main.component').then(c => c.AboutMainComponent),
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./overview/overview.component').then(c => c.OverviewComponent),
      }
    ]
  }
] satisfies Routes;
