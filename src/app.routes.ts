import { mapToCanActivate, mapToCanActivateChild, mapToCanMatch, Routes } from '@angular/router';
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
import { HotelReportsComponent } from './app/pages/hotel-reports/hotel-reports.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponenet, canMatch: mapToCanMatch([GuestGuard]) },
  // Root URL hech qachon bo'sh holatda qolmasin: avval Cabinet yo'liga o'tadi,
  // keyin AuthGuard sessiyaga qarab Cabinet yoki Login sahifasini tanlaydi.
  { path: '', pathMatch: 'full', redirectTo: 'cabinet' },
  {
    path: '',
    component: AppLayout,
    canActivate: mapToCanActivate([AuthGuard]),
    canActivateChild: mapToCanActivateChild([AuthGuard]),
    children: [
      { path: 'cabinet', component: CabinetComponent },
      { path: 'sales', component: SalesComponent, canActivate: mapToCanActivate([FridgeGuard]) },
      { path: 'inventory', component: InventoryComponent, canActivate: mapToCanActivate([FridgeGuard, AdminGuard]) },
      { path: 'products', component: ProductsComponent, canActivate: mapToCanActivate([FridgeGuard, AdminGuard]) },
      { path: 'sales-history', component: SalesHistoryComponent, canActivate: mapToCanActivate([FridgeGuard, AdminGuard]) },
      { path: 'hotel', pathMatch: 'full', redirectTo: 'hotel/bookings' },
      { path: 'hotel/bookings', component: HotelComponent, canActivate: mapToCanActivate([HotelGuard]), data: { section: 'bookings' } },
      { path: 'hotel/rooms', component: HotelComponent, canActivate: mapToCanActivate([HotelGuard, AdminGuard]), data: { section: 'rooms' } },
      { path: 'hotel/history', component: HotelComponent, canActivate: mapToCanActivate([HotelGuard]), data: { section: 'history' } },
      { path: 'hotel/expenses', component: HotelComponent, canActivate: mapToCanActivate([HotelGuard]), data: { section: 'expenses' } },
      { path: 'hotel/reports', component: HotelReportsComponent, canActivate: mapToCanActivate([HotelGuard, AdminGuard]) },
      { path: 'users', component: UsersComponent, canActivate: mapToCanActivate([AdminGuard]) },
    ]
  },
  { path: '**', redirectTo: '' }
];
