import {Route, Routes} from '@angular/router';

export const MembersRoutingRouting: Route[] = [
  {
    path: '',
    loadComponent: () => import('./components/members-main.component').then(c => c.MembersMainComponent),
    children: [
      {
        path: 'post-doc',
        loadComponent: () => import('./post-doc/post-doc.component').then(c => c.PostDocComponent),
      },
      {
        path: 'phd-candidate',
        loadComponent: () => import('./phd-candidate/phd-candidate.component').then(c => c.PhdCandidateComponent),
      },
      {
        path: 'master-candidate',
        loadComponent: () => import('./master-candidate/master-candidate.component').then(c => c.MasterCandidateComponent),
      },
      {
        path: 'undergraduate',
        loadComponent: () => import('./undergraduate/undergraduate.component').then(c => c.UndergraduateComponent),
      },
      {
        path: 'alumni',
        loadComponent: () => import('./alumni/alumni.component').then(c => c.AlumniComponent),
      },
    ]
  }
] satisfies Routes;
