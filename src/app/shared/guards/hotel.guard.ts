import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Injectable({ providedIn: 'root' })
export class HotelGuard implements CanActivate {
    private auth = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean | UrlTree {
        return this.auth.canUseHotel() ? true : this.router.parseUrl('/cabinet');
    }
}
