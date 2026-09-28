import { Injectable, inject } from '@angular/core';
import { CanMatch, Router, UrlTree, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanMatch {
    private router = inject(Router);
    private authService = inject(AuthService);

    canMatch(_route: Route, _segments: UrlSegment[]): Observable<boolean | UrlTree> {
        if (!this.authService.getAccessToken()) return of(true);
        return this.authService.ensureSession().pipe(
            map((isValid) => isValid ? this.router.parseUrl('/') : true)
        );
    }
}
