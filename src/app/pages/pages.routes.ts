import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { ContactsComponent } from './contacts/contacts.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';

export default [
    { path: '', component: ContactsComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'empty', component: Empty, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/notfound', canActivate: [AuthGuard] }
] as Routes;
