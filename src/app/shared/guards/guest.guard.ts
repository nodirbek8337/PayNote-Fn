import { Injectable } from '@angular/core';
import { CanMatch, Router, UrlTree, Route, UrlSegment } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanMatch {
  constructor(private router: Router) {}

  canMatch(_route: Route, _segments: UrlSegment[]): boolean | UrlTree {
    const hasToken = !!localStorage.getItem('payNoteToken');
    return hasToken ? this.router.parseUrl('/') : true;
  }
}
