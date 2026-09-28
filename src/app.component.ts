import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './app/shared/services/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `
    <p-toast key="global" position="top-right" appendTo="body" [baseZIndex]="999999"></p-toast>
    <router-outlet></router-outlet>
    @if (auth.sessionChecking()) {
        <div class="session-loading" role="status" aria-live="polite" aria-label="Sessiya tekshirilmoqda">
            <div class="session-loading__card">
                <i class="pi pi-spin pi-spinner"></i>
                <strong>Sessiya tekshirilmoqda</strong>
                <span>Ma’lumotlaringiz yuklanmoqda...</span>
            </div>
        </div>
    }
    `,
    styles: [`
        .session-loading { position: fixed; inset: 0; z-index: 1000000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: #071321; color: #dceaff; }
        .session-loading__card { position: relative; z-index: 1; display: flex; width: min(22rem, 100%); flex-direction: column; align-items: center; gap: .7rem; box-sizing: border-box; padding: 2rem 2.5rem; border: 1px solid #294c7c; border-radius: 14px; background: linear-gradient(180deg, #122a4a, #0b1c31); box-shadow: 0 22px 50px rgba(0,0,0,.42); text-align: center; }
        .session-loading__card .pi { display: block; color: #4f8cff; font-size: 2rem; }
        .session-loading__card strong { display: block; color: #dceaff; font-size: 1rem; }
        .session-loading__card span { display: block; color: #9db4d4; font-size: .88rem; }
    `]
})
export class AppComponent {
    readonly auth = inject(AuthService);
}
