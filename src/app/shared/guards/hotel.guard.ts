import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class HotelGuard implements CanActivate {
    private auth = inject(AuthService);
    private router = inject(Router);

    canActivate(): Observable<boolean | UrlTree> {
        return this.auth.ensureSession().pipe(
            map((isValid) => isValid && this.auth.canUseHotel() ? true : this.router.parseUrl('/cabinet'))
        );
    }
}
