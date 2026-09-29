import { mapToCanActivate, Routes } from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { InventoryComponent } from './inventory/inventory.component';
import { SalesComponent } from './sales/sales.component';
import { SalesHistoryComponent } from './sales-history/sales-history.component';
import { CabinetComponent } from './cabinet/cabinet.component';
import { AdminGuard } from '../shared/guards/admin.guard';
import { FridgeGuard } from '../shared/guards/fridge.guard';
import { HotelGuard } from '../shared/guards/hotel.guard';
import { HotelComponent } from './hotel/hotel.component';
import { HotelReportsComponent } from './hotel-reports/hotel-reports.component';

export default [
    { path: '', redirectTo: 'cabinet', pathMatch: 'full' },
    { path: 'cabinet', component: CabinetComponent, canActivate: mapToCanActivate([AuthGuard]) },
    { path: 'sales', component: SalesComponent, canActivate: mapToCanActivate([AuthGuard, FridgeGuard]) },
    { path: 'inventory', component: InventoryComponent, canActivate: mapToCanActivate([AuthGuard, FridgeGuard, AdminGuard]) },
    { path: 'products', component: ProductsComponent, canActivate: mapToCanActivate([AuthGuard, FridgeGuard, AdminGuard]) },
    { path: 'sales-history', component: SalesHistoryComponent, canActivate: mapToCanActivate([AuthGuard, FridgeGuard, AdminGuard]) },
    { path: 'hotel', pathMatch: 'full', redirectTo: 'hotel/bookings' },
    { path: 'hotel/bookings', component: HotelComponent, canActivate: mapToCanActivate([AuthGuard, HotelGuard]), data: { section: 'bookings' } },
    { path: 'hotel/rooms', component: HotelComponent, canActivate: mapToCanActivate([AuthGuard, HotelGuard, AdminGuard]), data: { section: 'rooms' } },
    { path: 'hotel/history', component: HotelComponent, canActivate: mapToCanActivate([AuthGuard, HotelGuard]), data: { section: 'history' } },
    { path: 'hotel/reports', component: HotelReportsComponent, canActivate: mapToCanActivate([AuthGuard, HotelGuard, AdminGuard]) },
    { path: 'users', component: UsersComponent, canActivate: mapToCanActivate([AuthGuard, AdminGuard]) },
    { path: '**', redirectTo: 'cabinet' }
] as Routes;
