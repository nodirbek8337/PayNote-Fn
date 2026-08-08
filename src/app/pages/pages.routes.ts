import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';

export default [
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },
    { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
    { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
    { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'inventory', canActivate: [AuthGuard] }
] as Routes;
