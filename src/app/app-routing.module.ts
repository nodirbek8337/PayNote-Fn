import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { OverviewComponent } from './modules/about-us/overview/overview.component';
import { ProfessorComponent } from './modules/professor/professor/professor.component';
import { IndustrialProfessorComponent } from './modules/professor/industrial-professor/industrial-professor.component';
import { CollaborationProfessorComponent } from './modules/professor/collaboration-professor/collaboration-professor.component';
import { VisitingProfessorComponent } from './modules/professor/visiting-professor/visiting-professor.component';
import { PostDocComponent } from './modules/members/post-doc/post-doc.component';
import { PhdCandidateComponent } from './modules/members/phd-candidate/phd-candidate.component';
import { MasterCandidateComponent } from './modules/members/master-candidate/master-candidate.component';
import { UndergraduateComponent } from './modules/members/undergraduate/undergraduate.component';
import { AlumniComponent } from './modules/members/alumni/alumni.component';
import { IntroductionComponent } from './modules/research/introduction/introduction.component';
import { PhdThesisComponent } from './modules/research/phd-thesis/phd-thesis.component';
import { TechnicalReportComponent } from './modules/research/technical-report/technical-report.component';
import { ColloquiumsComponent } from './modules/research/colloquiums/colloquiums.component';
import { OngoingProjectsComponent } from './modules/research/ongoing-projects/ongoing-projects.component';
import { PastProjectsComponent } from './modules/research/past-projects/past-projects.component';

const routes: Routes = [
  { path: '', component: HomepageComponent},
  { path: 'contact-us', component: ContactUsComponent},

  { path: 'about/overview', component: OverviewComponent},

  { path: 'professor/professor', component: ProfessorComponent},
  { path: 'professor/industrial-professor', component: IndustrialProfessorComponent},
  { path: 'professor/collaboration-professor', component: CollaborationProfessorComponent},
  { path: 'professor/visiting-professor', component: VisitingProfessorComponent},

  { path: 'members/post-doc', component: PostDocComponent},
  { path: 'members/phd-candidate', component: PhdCandidateComponent},
  { path: 'members/master-candidate', component: MasterCandidateComponent},
  { path: 'members/undergraduate', component:UndergraduateComponent},
  { path: 'members/alumni', component: AlumniComponent},

  { path: 'research/introduction', component: IntroductionComponent},
  { path: 'research/phd-thesis', component: PhdThesisComponent},
  { path: 'research/technical-report', component: TechnicalReportComponent},
  { path: 'research/colloquiums', component: ColloquiumsComponent},
  { path: 'research/ongoing-projects', component: OngoingProjectsComponent},
  { path: 'research/past-projects', component: PastProjectsComponent},

  
  { path: '**', component: HomepageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
