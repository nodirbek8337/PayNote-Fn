import { Routes } from '@angular/router';
import { LectureComponent } from './lecture.component';
import { LectureYearComponent } from './lecture-year.component';

export const lectureRoutes: Routes = [
  {
    path: '',
    component: LectureComponent,
  },
  {
    path: ':year',
    component: LectureYearComponent,
  }
];
