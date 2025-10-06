import { Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private _httpService: HttpService,
    private toast: ToastService,
    private injector: Injector
  ) {}

  private get translate() {
    return this.injector.get(TranslateService);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('payNoteToken');
  }

  login(data: any) {
    this.isLoading.set(true);
    this._httpService.post('/auth/login', data)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((value: any) => {
        localStorage.setItem('payNoteToken', value.token);
        if (value.status) {
          this.toast.success('Tizimga muvaffaqiyatli kirdingiz.');
          setTimeout(() => this.router.navigateByUrl('/', { replaceUrl: true }), 600);
        }
      });
  }

  logout(): void {
    localStorage.removeItem('payNoteToken');
    localStorage.removeItem('payNoteUser');
  }

  logoutAndRedirect(): void {
    this.logout();
    this.router.navigate(['auth/login']);
  }
}
