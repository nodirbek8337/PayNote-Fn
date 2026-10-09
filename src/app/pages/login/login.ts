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
                <section class="login-card">
                    <div class="login-form-panel">
                        <div class="login-brand">
                            <img src="/assets/images/esesuc-mark.svg" alt="" />
                            <span><b>EsEsUc</b><small>Clarity for every stay.</small></span>
                        </div>
                        <div class="login-intro">
                            <h1>Boshqaruv tizimiga xush kelibsiz</h1>
                        </div>

                        <form autocomplete="on" (ngSubmit)="onSubmit()">
                            <label for="paynote-entry-name" class="login-label">Foydalanuvchi nomi</label>
                            <app-input inputId="paynote-entry-name" inputName="username" autocomplete="username" [allowAutofill]="true" placeholder="Foydalanuvchi nomini kiriting" class="w-full login-field" [(ngModel)]="email" [ngModelOptions]="{ standalone: true }" [disabled]="_auth.isLoading()"></app-input>

                            <label for="paynote-entry-secret" class="login-label">Parol</label>
                            <app-input inputId="paynote-entry-secret" inputName="password" autocomplete="current-password" [allowAutofill]="true" [type]="'password'" [(ngModel)]="password" [ngModelOptions]="{ standalone: true }" placeholder="Parol kiriting" [disabled]="_auth.isLoading()" class="w-full login-field"></app-input>

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
                                type="submit"
                                class="w-full login-submit"
                                (click)="onSubmit()"
                                [disabled]="_auth.isLoading() || !email.trim() || !password"
                            >
                                @if (_auth.isLoading()) {
                                    <i class="pi pi-spinner pi-spin" aria-hidden="true"></i>
                                }
                                <span>{{ _auth.isServerWaking() ? 'Server kutilmoqda...' : 'Tizimga kirish' }}</span>
                            </button>
                        </form>
                        <footer class="login-footer">
                            <span class="login-footer__mark" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M3 22h18M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1M10 22v-4h4v4" /></svg>
                            </span>
                            <span class="login-footer__copy">
                                <b>Ninety Boutique</b>
                                <small>Mehmonxona boshqaruv paneli</small>
                            </span>
                            <span class="login-footer__secure" aria-hidden="true">
                                <svg viewBox="0 0 24 24"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3v8Z" /><path d="m9 12 2 2 4-4" /></svg>
                            </span>
                        </footer>
                    </div>
                    <aside class="login-showcase" aria-label="Ninety Boutique Personal hotel view"></aside>
                </section>
            </div>
        </div>
    `,
    styles: [
        `
            .login-page {
                min-height: 100dvh;
                display: grid;
                place-items: center;
                padding: clamp(1rem, 2vw, 2rem);
                overflow: auto;
                background:
                    radial-gradient(circle at 18% 12%, rgba(44, 132, 255, 0.2), transparent 27rem),
                    linear-gradient(135deg, #edf5ff 0%, #dceaff 48%, #f6f9ff 100%);
            }

            .login-shell {
                width: min(100%, 1360px);
            }

            .login-card {
                display: grid;
                grid-template-columns: minmax(390px, 0.9fr) minmax(520px, 1.1fr);
                width: 100%;
                min-height: min(760px, calc(100dvh - 4rem));
                padding: 0;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.9);
                border-radius: 28px;
                background: rgba(255, 255, 255, 0.92);
                box-shadow: 0 30px 80px rgba(28, 71, 133, 0.2);
            }

            .login-form-panel {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: clamp(2.25rem, 5vw, 5.75rem);
                background: linear-gradient(145deg, rgba(255,255,255,.98), rgba(244,249,255,.96));
            }

            .login-brand {
                display: flex;
                align-items: center;
                gap: .85rem;
                margin-bottom: clamp(2.2rem, 5vh, 4.5rem);
                color: #0b61d8;
            }

            .login-brand img { width: 58px; height: 58px; flex: 0 0 58px; overflow: visible; }

            .login-brand b,
            .login-brand small { display: block; }
            .login-brand b { font-size: 2rem; line-height: 1; letter-spacing: -.05em; }
            .login-brand small { margin-top: .32rem; color: #6c82a2; font-size: .78rem; font-weight: 650; letter-spacing: .01em; }

            .login-intro {
                margin: 0 0 2.25rem;
                text-align: left;
            }

            .login-intro h1 {
                max-width: 520px;
                margin: 0;
                color: #102247;
                font-size: clamp(1.8rem, 3vw, 2.7rem);
                font-weight: 850;
                line-height: 1.08;
                letter-spacing: -0.045em;
            }

            .login-label {
                display: block;
                margin: 0 0 0.45rem;
                color: #32486c;
                font-size: 0.82rem;
                font-weight: 800;
            }

            .login-field { margin-bottom: 1.25rem; }
            app-input.login-field { display: block; }
            .login-submit {
                height: 50px;
                margin-top: .5rem;
                border: 0 !important;
                border-radius: 10px !important;
                background: linear-gradient(90deg, #116ee8, #2789ff) !important;
                box-shadow: 0 14px 28px rgba(19, 111, 232, .25) !important;
                font-weight: 800 !important;
            }

            .login-footer {
                width: 100%;
                display: flex;
                align-items: center;
                gap: .8rem;
                margin-top: auto;
                padding: .82rem .9rem;
                border: 1px solid #d7e6f7;
                border-radius: 15px;
                background: linear-gradient(135deg, #f5faff, #edf6ff);
                color: #6f84a3;
                box-sizing: border-box;
                box-shadow: 0 10px 26px rgba(39, 101, 176, .07);
            }
            .login-footer__mark { width: 44px; height: 44px; display: grid; flex: 0 0 44px; place-items: center; border-radius: 13px; background: linear-gradient(145deg, #e9f4ff, #d5eaff); color: #1473e6; box-shadow: inset 0 0 0 1px rgba(48, 131, 230, .08); }
            .login-footer__mark svg { width: 23px; height: 23px; fill: none; stroke: currentColor; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; }
            .login-footer__copy,
            .login-footer b,
            .login-footer small { display: block; }
            .login-footer__copy { min-width: 0; flex: 1; }
            .login-footer b { color: #17345e; font-size: .9rem; letter-spacing: -.015em; }
            .login-footer small { margin-top: .16rem; color: #7186a4; font-size: .68rem; }
            .login-footer__secure { width: 36px; height: 36px; display: grid; flex: 0 0 36px; place-items: center; border-radius: 11px; background: #e8f8ef; color: #1b9a62; box-shadow: inset 0 0 0 1px rgba(27, 154, 98, .13); }
            .login-footer__secure svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

            .login-showcase {
                position: relative;
                min-height: 620px;
                overflow: hidden;
                background:
                    linear-gradient(110deg, rgba(4, 25, 58, .18), rgba(3, 18, 43, .12)),
                    url('/assets/images/esesuc-hotel-hero.png') 48% center / cover no-repeat;
                color: #fff;
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

            :host-context(html.app-dark) .login-page {
                background:
                    radial-gradient(circle at 18% 12%, rgba(38, 111, 219, .16), transparent 27rem),
                    linear-gradient(135deg, #07111f, #0a182a 55%, #050b14);
            }
            :host-context(html.app-dark) .login-card { border-color: #243b5e; background: #0d1b2f; box-shadow: 0 30px 80px rgba(0,0,0,.46); }
            :host-context(html.app-dark) .login-form-panel { background: linear-gradient(145deg, #0d1b2f, #091728); }
            :host-context(html.app-dark) .login-brand small,
            :host-context(html.app-dark) .login-label,
            :host-context(html.app-dark) .login-footer { color: #91a6c5; }
            :host-context(html.app-dark) .login-intro h1 { color: #edf5ff; }
            :host-context(html.app-dark) .login-submit,
            :host-context(html.app-dark) .login-submit .p-button-label,
            :host-context(html.app-dark) .login-submit .pi { color: #fff !important; }
            :host-context(html.app-dark) .login-footer { border-color: #243b5e; background: #10243d; }
            :host-context(html.app-dark) .login-footer b { color: #dceaff; }
            :host-context(html.app-dark) .login-footer__mark { background: #18365b; color: #83b6ff; }
            :host-context(html.app-dark) .login-footer__secure { background: #133b2d; color: #68d69a; }
            :host-context(html.app-dark) .login-showcase { background-image: linear-gradient(110deg, rgba(4, 18, 38, .22), rgba(2, 12, 27, .28)), url('/assets/images/esesuc-hotel-hero.png'); }

            @media (max-width: 1050px) {
                .login-card { grid-template-columns: minmax(360px, .95fr) minmax(420px, 1.05fr); }
                .login-form-panel { padding: 3rem; }
            }

            @media (max-width: 820px) {
                .login-card { display: block; min-height: 0; }
                .login-showcase { display: none; }
                .login-form-panel { min-height: calc(100dvh - 2rem); padding: clamp(1.5rem, 7vw, 3.5rem); }
                .login-brand { margin-bottom: 3rem; }
            }

            @media (max-width: 600px) {
                .login-page {
                    align-items: center;
                    padding: .65rem;
                }

                .login-card {
                    border-radius: 20px;
                }

                .login-form-panel {
                    min-height: calc(100dvh - 1.3rem);
                    padding: 1.5rem;
                }

                .login-brand { margin-bottom: 2.5rem; }
                .login-brand b { font-size: 1.65rem; }
                .login-intro h1 { font-size: 1.8rem; }
                .login-footer { max-width: 100%; padding: .72rem .75rem; gap: .65rem; }
                .login-footer__mark { width: 40px; height: 40px; flex-basis: 40px; }
                .login-footer__secure { width: 34px; height: 34px; flex-basis: 34px; }
                .login-footer b { font-size: .84rem; }
                .login-footer small { font-size: .63rem; }
            }

            @media (max-width: 360px) {
                .login-form-panel { padding: 1.2rem; }
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
        if (!this.email.trim() || !this.password) return;
        this._auth.login({ username: this.email, password: this.password });
    }

}
