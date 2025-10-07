import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { ContactsComponent } from './app/pages/contacts/contacts.component';
import { UsersComponent } from './app/pages/users/users.component';
import { LoginComponenet } from './app/pages/login/login';
import { AuthGuard } from './app/shared/guards/auth.guard';
import { GuestGuard } from './app/shared/guards/guest.guard';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponenet, canMatch: [GuestGuard] },
  {
    path: '',
    component: AppLayout,
    canMatch: [AuthGuard],
    children: [
      { path: '', component: ContactsComponent },
      { path: 'users', component: UsersComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
