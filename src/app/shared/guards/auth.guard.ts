import { Injectable } from '@angular/core';
import { CanMatch, Router, UrlTree, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree {
    const hasToken = this.authService.isAuthenticated();
    return hasToken ? true : this.router.parseUrl('/login');
  }
}
