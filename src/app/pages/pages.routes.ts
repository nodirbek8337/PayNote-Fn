import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';

export default [
    { path: '', redirectTo: 'sales', pathMatch: 'full' },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'sales-history', component: SalesHistoryComponent, canActivate: [AuthGuard] },
    { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'sales', canActivate: [AuthGuard] }
] as Routes;
