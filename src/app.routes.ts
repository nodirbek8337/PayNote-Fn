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
import { FridgeGuard } from './app/shared/guards/fridge.guard';
import { HotelGuard } from './app/shared/guards/hotel.guard';
import { CabinetComponent } from './app/pages/cabinet/cabinet.component';
import { HotelComponent } from './app/pages/hotel/hotel.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponenet, canMatch: [GuestGuard] },
  {
    path: '',
    component: AppLayout,
    canMatch: [AuthGuard],
    children: [
      { path: '', redirectTo: 'cabinet', pathMatch: 'full' },
      { path: 'cabinet', component: CabinetComponent },
      { path: 'sales', component: SalesComponent, canActivate: [FridgeGuard] },
      { path: 'inventory', component: InventoryComponent, canActivate: [FridgeGuard, AdminGuard] },
      { path: 'products', component: ProductsComponent, canActivate: [FridgeGuard, AdminGuard] },
      { path: 'sales-history', component: SalesHistoryComponent, canActivate: [FridgeGuard, AdminGuard] },
      { path: 'hotel', pathMatch: 'full', redirectTo: 'hotel/bookings' },
      { path: 'hotel/bookings', component: HotelComponent, canActivate: [HotelGuard], data: { section: 'bookings' } },
      { path: 'hotel/rooms', component: HotelComponent, canActivate: [HotelGuard, AdminGuard], data: { section: 'rooms' } },
      { path: 'hotel/history', component: HotelComponent, canActivate: [HotelGuard, AdminGuard], data: { section: 'history' } },
      { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
    ]
  },
  { path: '**', redirectTo: '' }
];
