import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';
import { CabinetComponent } from './cabinet/cabinet.component';
import { AdminGuard } from '../shared/guards/admin.guard';

export default [
    { path: '', redirectTo: 'cabinet', pathMatch: 'full' },
    { path: 'cabinet', component: CabinetComponent, canActivate: [AuthGuard] },
    { path: 'sales', component: SalesComponent, canActivate: [AuthGuard] },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'sales-history', component: SalesHistoryComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard, AdminGuard] },
    { path: '**', redirectTo: 'cabinet', canActivate: [AuthGuard] }
] as Routes;
