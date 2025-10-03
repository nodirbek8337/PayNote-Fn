import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { ContactsComponent } from './contacts/contacts.component';

export default [
    { path: '', component: ContactsComponent },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
