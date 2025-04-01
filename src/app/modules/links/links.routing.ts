import {Route, Routes} from '@angular/router';

export const LinksRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/links-main.component').then(c => c.LinksMainComponent),
    children: [
      {
        path: 'software',
        loadComponent: () => import('./software/software.component').then(c => c.SoftwareComponent),
      },
      {
        path: 'useful-links',
        loadComponent: () => import('./useful-links/useful-links.component').then(c => c.UsefulLinksComponent),
      },
      {
        path: 'gov-institutes',
        loadComponent: () => import('./gov-institutes/gov-institutes.component').then(c => c.GovInstitutesComponent),
      },
      {
        path: 'miscellaneous',
        loadComponent: () => import('./miscellaneous/miscellaneous.component').then(c => c.MiscellaneousComponent),
      },{
        path: 'workshop',
        loadComponent: () => import('./workshop/workshop.component').then(c => c.WorkshopComponent),
      },
    ]
  }
] satisfies Routes;
