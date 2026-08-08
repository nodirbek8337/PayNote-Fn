import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { UsersComponent } from './app/pages/users/users.component';
import { InventoryComponent } from './app/pages/inventory/inventory.component';
import { ProductsComponent } from './app/pages/products/products.component';
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
      { path: '', redirectTo: 'inventory', pathMatch: 'full' },
      { path: 'inventory', component: InventoryComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'users', component: UsersComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
