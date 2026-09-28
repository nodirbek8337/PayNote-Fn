import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputPassword } from 'primeng/inputpassword';
import { RippleModule } from 'primeng/ripple';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from '../../layout/service/layout.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonDirective, CheckboxModule, InputTextModule, InputPassword, FormsModule, RouterModule, RippleModule],
    template: `
        <div class="login-page">
            <div class="login-shell">
                <div class="login-frame">
                    <div class="login-card">
                        <div class="text-center mb-8">
                            <div class="login-content">
                                <img src="assets/images/logo.png" alt="Pay Note" width="100" />
                            </div>
                            <div class="text-3xl font-medium mb-4" style="color: var(--text-color)">Pay Note ga xush kelibsiz!</div>
                            <span class="text-muted-color font-medium">Tizimga kirish</span>
                        </div>

                        <div>
                            <label for="paynote-entry-name" class="block text-xl font-medium mb-2" style="color: var(--text-color)">Foydalanuvchi nomi</label>
                            <input pInputText id="paynote-entry-name" name="username" type="text" autocomplete="username" placeholder="Foydalanuvchi nomini kiriting" class="w-full mb-4" [(ngModel)]="email" [disabled]="_auth.isLoading()" />

                            <label for="paynote-entry-secret" class="block font-medium text-xl mb-2" style="color: var(--text-color)">Parol</label>
                            <div class="password-field mb-4">
                                <input
                                    pInputPassword
                                    id="paynote-entry-secret"
                                    name="password"
                                    autocomplete="current-password"
                                    [(ngModel)]="password"
                                    placeholder="Parol kiriting"
                                    [mask]="passwordMasked"
                                    [disabled]="_auth.isLoading()"
                                    class="w-full"
                                />
                                <button
                                    type="button"
                                    class="password-toggle"
                                    (click)="togglePasswordMask()"
                                    [disabled]="_auth.isLoading()"
                                    [attr.aria-label]="passwordMasked ? 'Parolni ko‘rsatish' : 'Parolni yashirish'"
                                >
                                    <i class="pi" [ngClass]="passwordMasked ? 'pi-eye' : 'pi-eye-slash'" aria-hidden="true"></i>
                                </button>
                            </div>

                            @if (_auth.isLoading()) {
                                <div class="login-status" [class.is-waking]="_auth.isServerWaking()" aria-live="polite">
                                    <i class="pi" [ngClass]="_auth.isServerWaking() ? 'pi-server' : 'pi-spin pi-spinner'"></i>
                                    <div>
                                        <strong>{{ _auth.isServerWaking() ? 'Server ishga tushmoqda' : "Ma'lumotlar tekshirilmoqda" }}</strong>
                                        @if (_auth.isServerWaking()) {
                                            <span>Birinchi ulanish bir daqiqagacha vaqt olishi mumkin. Iltimos, sahifani yopmasdan kuting.</span>
                                        }
                                    </div>
                                </div>
                            }

                            <button
                                pButton
                                type="button"
                                class="w-full mt-6"
                                (click)="onSubmit()"
                                [disabled]="_auth.isLoading() || !email.trim() || !password"
                            >
                                @if (_auth.isLoading()) {
                                    <i class="pi pi-spinner pi-spin" aria-hidden="true"></i>
                                }
                                <span>{{ _auth.isServerWaking() ? 'Server kutilmoqda...' : 'Tizimga kirish' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .login-page {
                min-height: 100dvh;
                display: grid;
                place-items: center;
                padding: 1rem;
                overflow: hidden;
                background: var(--surface-ground);
            }

            .login-shell {
                width: min(100%, 560px);
            }

            .login-frame {
                padding: 0.3rem;
                border-radius: 20px;
                background: linear-gradient(180deg, var(--action-primary) 0%, transparent 38%);
            }

            .login-card {
                width: 100%;
                padding: 3.5rem 4rem;
                border-radius: 18px;
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                box-shadow: var(--paynote-shadow);
            }

            .login-status {
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                margin-top: 0.5rem;
                padding: 0.8rem;
                border: 1px solid color-mix(in srgb, var(--action-primary) 35%, var(--surface-border));
                border-radius: 10px;
                background: var(--action-primary-soft);
                color: var(--text-color);
            }

            .login-status > i {
                margin-top: 0.15rem;
                color: var(--action-primary-from);
            }

            .login-status strong,
            .login-status span {
                display: block;
            }

            .login-status span {
                margin-top: 0.25rem;
                color: var(--text-color-secondary);
                line-height: 1.4;
            }

            .login-status.is-waking {
                border-color: color-mix(in srgb, #f59e0b 50%, var(--surface-border));
                background: color-mix(in srgb, #f59e0b 12%, var(--surface-card));
            }

            .password-field {
                position: relative;
            }

            .password-field input {
                padding-right: 3.25rem;
            }

            .password-toggle {
                position: absolute;
                top: 50%;
                right: 0.75rem;
                display: grid;
                width: 2rem;
                height: 2rem;
                place-items: center;
                border: 0;
                border-radius: 0.5rem;
                color: var(--text-color-secondary);
                background: transparent;
                cursor: pointer;
            }

            .password-toggle:hover:not(:disabled) {
                color: var(--action-primary-from);
                background: var(--action-primary-soft);
            }

            .password-toggle:disabled {
                cursor: not-allowed;
                opacity: 0.6;
            }

            @media (max-width: 600px) {
                .login-page {
                    align-items: center;
                    padding: 0.75rem;
                }

                .login-card {
                    padding: 2rem 1.25rem;
                }
            }

            @media (max-width: 360px) {
                .login-card {
                    padding: 1.5rem 1rem;
                }
            }
        `
    ]
})
export class LoginComponenet implements OnInit {
    email: string = '';

    password: string = '';

    passwordMasked = true;

    checked: boolean = false;

    _http = inject(HttpClient);
    _auth = inject(AuthService);
    private layout = inject(LayoutService);

    ngOnInit() {
        this.layout.toggleDarkMode(this.layout.layoutConfig());
    }

    onSubmit() {
        this._auth.login({ username: this.email, password: this.password });
    }

    togglePasswordMask() {
        this.passwordMasked = !this.passwordMasked;
    }
}
