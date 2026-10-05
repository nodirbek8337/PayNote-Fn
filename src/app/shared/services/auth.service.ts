import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

export type SessionUser = { id: string; username: string; role: 'admin' | 'user' | 'manager' };
type LoginResponse = { token?: string };
type MeResponse = { success?: boolean; data?: SessionUser };

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly toast = inject(ToastService);

    readonly isLoading = signal(false);
    readonly isServerWaking = signal(false);
    /** True only while the token is being verified through /auth/me. */
    readonly sessionChecking = signal(false);
    readonly currentUser = signal<SessionUser | null>(null);

    private readonly tokenCookieName = 'payNoteToken';
    private readonly userCookieName = 'payNoteUser';
    private readonly serverWakeNoticeDelayMs = 4000;
    private serverWakeTimer: ReturnType<typeof setTimeout> | null = null;
    private sessionCheck$?: Observable<boolean>;
    private validatedToken: string | null = null;

    /** Token existsligi yetarli emas; foydalanishdan oldin serverdagi /auth/me tasdiqlaydi. */
    isAuthenticated(): boolean {
        return !!this.currentUser() && this.validatedToken === this.getAccessToken();
    }

    getCurrentUser(): SessionUser | null { return this.currentUser(); }
    getRole(): string | null { return this.currentUser()?.role ?? null; }
    isAdmin(): boolean { return this.getRole() === 'admin'; }
    canUseFridge(): boolean { return ['admin', 'user'].includes(this.getRole() ?? ''); }
    canUseHotel(): boolean { return ['admin', 'manager', 'user'].includes(this.getRole() ?? ''); }
    isHotelManager(): boolean { return this.getRole() === 'manager'; }

    /** Bir reload davomida barcha guardlar bitta /auth/me javobidan foydalanadi. */
    ensureSession(): Observable<boolean> {
        const token = this.getAccessToken();
        if (!token) {
            this.clearSession();
            return of(false);
        }
        if (this.validatedToken === token && this.currentUser()) return of(true);
        if (this.sessionCheck$) return this.sessionCheck$;

        this.sessionChecking.set(true);
        this.sessionCheck$ = this.http.get<MeResponse>(`${environment.apiUrl}/auth/me`).pipe(
            map((response) => response?.success === true ? response.data : null),
            tap((user) => {
                if (!user?.id || !user.username || !user.role) throw new Error('Noto‘g‘ri me javobi');
                this.currentUser.set(user);
                this.writeCookie(this.userCookieName, JSON.stringify(user));
                this.validatedToken = token;
            }),
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            }),
            finalize(() => {
                this.sessionCheck$ = undefined;
                this.sessionChecking.set(false);
            }),
            shareReplay({ bufferSize: 1, refCount: false })
        );
        return this.sessionCheck$;
    }

    login(data: { username: string; password: string }): void {
        if (this.isLoading()) return;
        this.isLoading.set(true);
        this.isServerWaking.set(false);
        this.serverWakeTimer = setTimeout(() => this.isServerWaking.set(true), this.serverWakeNoticeDelayMs);

        this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
            tap((response) => {
                if (!response?.token) throw new Error('Token olinmadi');
                this.writeCookie(this.tokenCookieName, response.token);
                this.validatedToken = null;
                this.currentUser.set(null);
            }),
            switchMap(() => this.ensureSession()),
            finalize(() => this.finishLoginRequest())
        ).subscribe({
            next: (isValid) => {
                if (!isValid) {
                    this.toast.error('Sessiyani tasdiqlab bo‘lmadi. Qayta login qiling.');
                    return;
                }
                this.toast.success('Tizimga muvaffaqiyatli kirdingiz.');
                this.router.navigateByUrl('/cabinet', { replaceUrl: true });
            },
            error: () => {}
        });
    }

    logout(): void { this.clearSession(); }
    logoutAndRedirect(): void {
        this.clearSession();
        this.router.navigate(['/login']);
    }

    getAccessToken(): string | null { return this.readCookie(this.tokenCookieName); }

    private clearSession(): void {
        this.validatedToken = null;
        this.currentUser.set(null);
        this.sessionChecking.set(false);
        this.deleteCookie(this.tokenCookieName);
        this.deleteCookie(this.userCookieName);
        if (typeof localStorage !== 'undefined') localStorage.removeItem('payNoteUser');
    }

    private readCookie(name: string): string | null {
        if (typeof document === 'undefined') return null;
        const item = document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
        return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
    }

    private writeCookie(name: string, value: string): void {
        if (typeof document === 'undefined') return;
        const secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${60 * 60 * 24 * 7}; Path=/; SameSite=Lax${secure}`;
    }

    private deleteCookie(name: string): void {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    }

    private finishLoginRequest(): void {
        if (this.serverWakeTimer) clearTimeout(this.serverWakeTimer);
        this.serverWakeTimer = null;
        this.isLoading.set(false);
        this.isServerWaking.set(false);
    }
}
