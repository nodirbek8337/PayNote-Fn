import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { RippleModule } from 'primeng/ripple';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from '../../layout/service/layout.service';
import { AuthService } from '../../shared/services/auth.service';
import { InputComponent } from '../../shared/components/input/input.component';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonDirective, CheckboxModule, FormsModule, RouterModule, RippleModule, InputComponent],
    template: `
        <div class="login-page">
            <div class="login-shell">
                <div class="login-frame">
                    <div class="login-card">
                        <div class="login-intro">
                            <div class="login-content">
                                <img src="assets/images/logo.png" alt="Pay Note" width="100" />
                            </div>
                            <h1>PayNote’ga xush kelibsiz!</h1>
                            <span>Tizimga kirish</span>
                        </div>

                        <div>
                            <label for="paynote-entry-name" class="login-label">Foydalanuvchi nomi</label>
                            <app-input inputId="paynote-entry-name" inputName="username" autocomplete="username" placeholder="Foydalanuvchi nomini kiriting" class="w-full login-field" [(ngModel)]="email" [disabled]="_auth.isLoading()"></app-input>

                            <label for="paynote-entry-secret" class="login-label">Parol</label>
                            <app-input inputId="paynote-entry-secret" inputName="password" autocomplete="current-password" [type]="'password'" [(ngModel)]="password" placeholder="Parol kiriting" [disabled]="_auth.isLoading()" class="w-full login-field"></app-input>

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
                                class="w-full login-submit"
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
                width: min(100%, 540px);
            }

            .login-frame {
                padding: 0.3rem;
                border-radius: 20px;
                background: linear-gradient(180deg, var(--action-primary) 0%, transparent 38%);
            }

            .login-card {
                width: 100%;
                padding: 2.75rem 3.5rem;
                border-radius: 18px;
                background: var(--surface-card);
                border: 1px solid var(--surface-border);
                box-shadow: var(--paynote-shadow);
            }

            .login-intro {
                margin: 0 0 2rem;
                text-align: center;
            }

            .login-intro h1 {
                margin: 0 0 0.4rem;
                color: var(--text-color);
                font-size: clamp(1.35rem, 3vw, 1.6rem);
                font-weight: 700;
                letter-spacing: -0.02em;
            }

            .login-intro span {
                color: var(--text-color-secondary);
                font-size: 0.92rem;
                font-weight: 600;
            }

            .login-label {
                display: block;
                margin: 0 0 0.45rem;
                color: var(--text-color);
                font-size: 0.94rem;
                font-weight: 700;
            }

            .login-field { margin-bottom: 1.15rem; }
            app-input.login-field { display: block; }
            .login-submit { margin-top: 0.35rem; }

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

}
