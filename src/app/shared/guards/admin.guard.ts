import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    private router = inject(Router);
    private authService = inject(AuthService);

    canActivate(): Observable<boolean | UrlTree> {
        return this.authService.ensureSession().pipe(
            map((isValid) => isValid && this.authService.isAdmin() ? true : this.router.parseUrl('/cabinet'))
        );
    }
}
