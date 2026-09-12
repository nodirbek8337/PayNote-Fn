import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from '../../layout/service/layout.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
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
                            <label for="email1" class="block text-xl font-medium mb-2" style="color: var(--text-color)">Foydalanuvchi nomi</label>
                            <input pInputText id="email1" type="text" placeholder="Foydalanuvchi nomini kiriting" class="w-full mb-4" [(ngModel)]="email" [disabled]="_auth.isLoading()" />

                            <label for="password1" class="block font-medium text-xl mb-2" style="color: var(--text-color)">Parol</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Parol kiriting" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" [disabled]="_auth.isLoading()"></p-password>

                            <div class="login-status" [class.is-waking]="_auth.isServerWaking()" *ngIf="_auth.isLoading()" aria-live="polite">
                                <i class="pi" [ngClass]="_auth.isServerWaking() ? 'pi-server' : 'pi-spin pi-spinner'"></i>
                                <div>
                                    <strong>{{ _auth.isServerWaking() ? 'Server ishga tushmoqda' : "Ma'lumotlar tekshirilmoqda" }}</strong>
                                    <span *ngIf="_auth.isServerWaking()">Birinchi ulanish bir daqiqagacha vaqt olishi mumkin. Iltimos, sahifani yopmasdan kuting.</span>
                                </div>
                            </div>

                            <p-button
                                (onClick)="onSubmit()"
                                [label]="_auth.isServerWaking() ? 'Server kutilmoqda...' : 'Tizimga kirish'"
                                styleClass="w-full mt-6"
                                [loading]="_auth.isLoading()"
                                [disabled]="_auth.isLoading() || !email.trim() || !password"
                            ></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
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
    `]
})
export class LoginComponenet {
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
