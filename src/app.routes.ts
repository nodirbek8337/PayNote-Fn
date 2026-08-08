import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { UsersComponent } from './app/pages/users/users.component';
import { InventoryComponent } from './app/pages/inventory/inventory.component';
import { ProductsComponent } from './app/pages/products/products.component';
import { SalesComponent } from './app/pages/sales/sales.component';
import { SalesHistoryComponent } from './app/pages/sales-history/sales-history.component';
import { LoginComponenet } from './app/pages/login/login';
import { AuthGuard } from './app/shared/guards/auth.guard';
import { GuestGuard } from './app/shared/guards/guest.guard';
import { AdminGuard } from './app/shared/guards/admin.guard';
import { CabinetComponent } from './app/pages/cabinet/cabinet.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponenet, canMatch: [GuestGuard] },
  {
    path: '',
    component: AppLayout,
    canMatch: [AuthGuard],
    children: [
      { path: '', redirectTo: 'cabinet', pathMatch: 'full' },
      { path: 'cabinet', component: CabinetComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'inventory', component: InventoryComponent, canActivate: [AdminGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [AdminGuard] },
      { path: 'sales-history', component: SalesHistoryComponent, canActivate: [AdminGuard] },
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
    ]
  },
  { path: '**', redirectTo: '' }
];
