import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./modules/homepage/homepage.component').then(m => m.HomepageComponent)
  },
  { 
    path: 'about', 
    loadChildren: () => import('./modules/about-us/about-us.routing').then(m => m.AboutUsRoutingRouting) 
  },
  { 
    path: 'professor', 
    loadChildren: () => import('./modules/professor/professor.routing').then(m => m.ProfessorRoutingRouting) 
  },
  { 
    path: 'members', 
    loadChildren: () => import('./modules/members/members.routing').then(m => m.MembersRoutingRouting) 
  },
  { 
    path: 'research', 
    loadChildren: () => import('./modules/re-search/re-search.routing').then(m => m.ReSearchRoutingRouting) 
  },
  { 
    path: 'publications/:id', 
    loadComponent: () => import('./modules/publications/publications.component').then(m => m.PublicationsComponent) 
  },
  { 
    path: 'lecture/2020', 
    loadComponent: () => import('./modules/publications/two-2020/two-2020.component').then(m => m.Two2020Component) 
  },
  { 
    path: 'contact-us', 
    loadComponent: () => import('./modules/about-us/contact-us/contact-us.component').then(m => m.ContactUsComponent) 
  },
  { 
    path: '**', 
    loadComponent: () => import('./modules/homepage/homepage.component').then(m => m.HomepageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
