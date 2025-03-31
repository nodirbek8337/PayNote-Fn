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

import { Two2025Component } from './modules/publications/two-2025/two-2025.component';
import { Two2024Component } from './modules/publications/two-2024/two-2024.component';
import { Two2023Component } from './modules/publications/two-2023/two-2023.component';
import { Two2022Component } from './modules/publications/two-2022/two-2022.component';
import { Two2021Component } from './modules/publications/two-2021/two-2021.component';
import { Two2020Component } from './modules/publications/two-2020/two-2020.component';
import { Two2019Component } from './modules/publications/two-2019/two-2019.component';
import { Two2018Component } from './modules/publications/two-2018/two-2018.component';
import { Two2017Component } from './modules/publications/two-2017/two-2017.component';
import { Two2016Component } from './modules/publications/two-2016/two-2016.component';
import { Two2015Component } from './modules/publications/two-2015/two-2015.component';
import { Two2014Component } from './modules/publications/two-2014/two-2014.component';
import { Two2013Component } from './modules/publications/two-2013/two-2013.component';
import { Two2012Component } from './modules/publications/two-2012/two-2012.component';
import { Two2011Component } from './modules/publications/two-2011/two-2011.component';
import { Two2010Component } from './modules/publications/two-2010/two-2010.component';
import { Two2009Component } from './modules/publications/two-2009/two-2009.component';
import { Two2008Component } from './modules/publications/two-2008/two-2008.component';
import { AllComponent } from './modules/publications/all/all.component';
import { PublicationsComponent } from './modules/publications/publications.component';

// import { Two2020Component } from './modules/lecture/two2020/two2020.component';

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

  { path: 'publications/:id', component: PublicationsComponent},

  { path: 'lecture/2020', component: Two2020Component},



  
  { path: '**', component: HomepageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
