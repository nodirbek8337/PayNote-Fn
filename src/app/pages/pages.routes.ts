import { Routes } from '@angular/router';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';

export default [
    { path: '', component: ContactsComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', canActivate: [AuthGuard] }
] as Routes;
