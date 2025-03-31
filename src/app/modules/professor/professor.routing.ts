import {Route, Routes} from '@angular/router';

export const ProfessorRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/professor-main.component').then(c => c.ProfessorMainComponent),
    children: [
      {
        path: 'professor',
        loadComponent: () => import('./professor/professor.component').then(c => c.ProfessorComponent),
      },
      {
        path: 'industrial-professor',
        loadComponent: () => import('./industrial-professor/industrial-professor.component').then(c => c.IndustrialProfessorComponent),
      },
      {
        path: 'collaboration-professor',
        loadComponent: () => import('./collaboration-professor/collaboration-professor.component').then(c => c.CollaborationProfessorComponent),
      },
      {
        path: 'visiting-professor',
        loadComponent: () => import('./visiting-professor/visiting-professor.component').then(c => c.VisitingProfessorComponent),
      },
    ]
  }
] satisfies Routes;
