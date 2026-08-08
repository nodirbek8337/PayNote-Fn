import { Injectable, Injector, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
    public isLoading = signal<boolean>(false);
    private readonly tokenCookieName = 'payNoteToken';

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
        return !!this.getAccessToken();
    }

    getCurrentUser(): { id?: string; username?: string; role?: string } | null {
        if (typeof localStorage === 'undefined') return null;

        try {
            const raw = localStorage.getItem('payNoteUser');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    getRole(): string | null {
        return this.getCurrentUser()?.role ?? null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'admin';
    }

    getAccessToken(): string | null {
        if (typeof document === 'undefined') return null;

        const cookie = document.cookie
            .split(';')
            .map((part) => part.trim())
            .find((part) => part.startsWith(`${this.tokenCookieName}=`));

        return cookie ? decodeURIComponent(cookie.slice(this.tokenCookieName.length + 1)) : null;
    }

    login(data: any) {
    this.isLoading.set(true);
    this._httpService.post('/auth/login', data)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe((value: any) => {
        if (!value?.token) return;
        this.setAccessToken(value.token);
        localStorage.setItem(
            'payNoteUser',
            JSON.stringify({
            id: value?.user?.id,
            role: value?.user?.role,
            username: value?.user?.username
            })
        );
        this.toast.success('Tizimga muvaffaqiyatli kirdingiz.');
        this.router.navigateByUrl('/cabinet', { replaceUrl: true });
        });
    }

    logout(): void {
        this.clearAccessToken();
        this.clearStoredSession();
    }

    logoutAndRedirect(): void {
        this.logout();
        this.router.navigate(['/login']);
    }

    private setAccessToken(token: string): void {
        if (typeof document === 'undefined') return;

        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `${this.tokenCookieName}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    }

    private clearAccessToken(): void {
        if (typeof document === 'undefined') return;

        document.cookie = `${this.tokenCookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
    }

    private clearStoredSession(): void {
        this.removePayNoteStorageKeys(localStorage);
        this.removePayNoteStorageKeys(sessionStorage);
    }

    private removePayNoteStorageKeys(storage: Storage | undefined): void {
        if (typeof storage === 'undefined') return;

        Object.keys(storage)
            .filter((key) => key.startsWith('payNote'))
            .forEach((key) => storage.removeItem(key));
    }
}
