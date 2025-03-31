import {Route, Routes} from '@angular/router';

export const LinksRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/links-main.component').then(c => c.LinksMainComponent),
    children: [
      {
        path: 'phd-candidate',
        loadComponent: () => import('./software/software.component').then(c => c.SoftwareComponent),
      },
      {
        path: 'master-candidate',
        loadComponent: () => import('./useful-links/useful-links.component').then(c => c.UsefulLinksComponent),
      },
      {
        path: 'undergraduate',
        loadComponent: () => import('./gov-institutes/gov-institutes.component').then(c => c.GovInstitutesComponent),
      },
      {
        path: 'alumni',
        loadComponent: () => import('./miscellaneous/miscellaneous.component').then(c => c.MiscellaneousComponent),
      },{
        path: 'alumni',
        loadComponent: () => import('./workshop/workshop.component').then(c => c.WorkshopComponent),
      },
    ]
  }
] satisfies Routes;
