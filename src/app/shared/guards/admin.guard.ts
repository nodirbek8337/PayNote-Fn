import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    private router = inject(Router);
    private authService = inject(AuthService);

    canActivate(): boolean | UrlTree {
        return this.authService.isAdmin() ? true : this.router.parseUrl('/cabinet');
    }
}
