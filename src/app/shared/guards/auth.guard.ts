import { Injectable, inject } from '@angular/core';
import { CanActivate, CanMatch, Router, UrlTree, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch, CanActivate {
    private router = inject(Router);
    private authService = inject(AuthService);

    canMatch(_route: Route, _segments: UrlSegment[]): Observable<boolean | UrlTree> {
        return this.authorize();
    }

    canActivate(): Observable<boolean | UrlTree> {
        return this.authorize();
    }

    private authorize(): Observable<boolean | UrlTree> {
        return this.authService.ensureSession().pipe(
            map((isValid) => isValid ? true : this.router.parseUrl('/login'))
        );
    }
}
