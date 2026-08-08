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
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule],
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
                            <label for="email1" class="block text-xl font-medium mb-2" style="color: var(--text-color)">Username</label>
                            <input pInputText id="email1" type="text" placeholder="Username kiriting" class="w-full mb-4" [(ngModel)]="email" />

                            <label for="password1" class="block font-medium text-xl mb-2" style="color: var(--text-color)">Parol</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Parol kiriting" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>
                            <p-button (onClick)="onSubmit()" label="Tizimga kirish" styleClass="w-full mt-6"></p-button>
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
