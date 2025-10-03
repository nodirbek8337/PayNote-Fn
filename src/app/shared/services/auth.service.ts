import { Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isLoading = signal<boolean>(false);

  constructor(
    private router: Router,
    private _httpService: HttpService,
    private messageService: MessageService,
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
    this._httpService.post('/api/v1/user/login', data).subscribe({
      next: (value: any) => {
        localStorage.setItem('payNoteToken', value.token);
        if (value.status) {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('Messages.Success'),
            detail: this.translate.instant('Messages.LoginSuccessfully')
          });
          setTimeout(() => {
            this.router.navigateByUrl('/', { replaceUrl: true });
          }, 200);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('Messages.Error'),
            detail: this.translate.instant('ErrorResponse.401')
          });
        }
      },
      complete: () => this.isLoading.set(false)
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
