import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  get auth$() {
    return this.authState.asObservable();
  }

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('login_access_token');
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  logout() {
    localStorage.removeItem('login_access_token');
    this.authState.next(false);
  }

  login(token: string) {
    localStorage.setItem('login_access_token', token);
    this.authState.next(true);
  }
}
