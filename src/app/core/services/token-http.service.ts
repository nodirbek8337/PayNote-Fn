import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenHttpService {
  constructor(private http: HttpClient, private router: Router) {}

  private checkTokenOrRedirect(): boolean {
    const token = localStorage.getItem('login_access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  post<T>(url: string, data: any): Observable<T> {
    const token = localStorage.getItem('login_access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token yo‘q'));
    }
  
    return this.http.post<T>(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  put<T>(url: string, data: any): Observable<T> {
    const token = localStorage.getItem('login_access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token yo‘q'));
    }
  
    return this.http.put<T>(url, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  delete<T>(url: string): Observable<T> {
    const token = localStorage.getItem('login_access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token yo‘q'));
    }
  
    return this.http.delete<T>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }
}
