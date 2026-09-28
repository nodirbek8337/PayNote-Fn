import { Injectable, inject } from '@angular/core';
import { CanMatch, Router, UrlTree, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanMatch {
    private router = inject(Router);
    private authService = inject(AuthService);

    canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree {
        const hasToken = this.authService.isAuthenticated();
        return hasToken ? this.router.parseUrl('/') : true;
    }
}
