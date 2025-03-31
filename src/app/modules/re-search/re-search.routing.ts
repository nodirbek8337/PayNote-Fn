import {Route, Routes} from '@angular/router';

export const ReSearchRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/re-search-main.component').then(c => c.ReSearchMainComponent),
    children: [
      {
        path: 'introduction',
        loadComponent: () => import('./introduction/introduction.component').then(c => c.IntroductionComponent),
      },
      {
        path: 'phd-thesis',
        loadComponent: () => import('./phd-thesis/phd-thesis.component').then(c => c.PhdThesisComponent),
      },
      {
        path: 'technical-report',
        loadComponent: () => import('./technical-report/technical-report.component').then(c => c.TechnicalReportComponent),
      },
      {
        path: 'colloquiums',
        loadComponent: () => import('./colloquiums/colloquiums.component').then(c => c.ColloquiumsComponent),
      },
      {
        path: 'ongoing-projects',
        loadComponent: () => import('./ongoing-projects/ongoing-projects.component').then(c => c.OngoingProjectsComponent),
      },
      {
        path: 'past-projects',
        loadComponent: () => import('./past-projects/past-projects.component').then(c => c.PastProjectsComponent),
      },
    ]
  }
] satisfies Routes;
