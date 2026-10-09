import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './app/shared/services/auth.service';
import { LayoutService } from './app/layout/service/layout.service';

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
        .session-loading { position: fixed; inset: 0; z-index: 1000000; display: flex; align-items: center; justify-content: center; padding: 1rem; background: radial-gradient(circle at 50% 42%, #edf6ff, #dfeeff 58%, #d2e4fa); color: #193155; }
        .session-loading__card { position: relative; z-index: 1; display: flex; width: min(22rem, 100%); flex-direction: column; align-items: center; gap: .7rem; box-sizing: border-box; padding: 2rem 2.5rem; border: 1px solid #cfe0f3; border-radius: 16px; background: rgba(255,255,255,.94); box-shadow: 0 22px 50px rgba(43,83,132,.16); text-align: center; }
        .session-loading__card .pi { display: block; color: #1976e9; font-size: 2rem; }
        .session-loading__card strong { display: block; color: #193155; font-size: 1rem; }
        .session-loading__card span { display: block; color: #69809f; font-size: .88rem; }
        :host-context(html.app-dark) .session-loading { background: #071321; color: #dceaff; }
        :host-context(html.app-dark) .session-loading__card { border-color: #294c7c; background: linear-gradient(180deg, #122a4a, #0b1c31); box-shadow: 0 22px 50px rgba(0,0,0,.42); }
        :host-context(html.app-dark) .session-loading__card .pi { color: #4f8cff; }
        :host-context(html.app-dark) .session-loading__card strong { color: #dceaff; }
        :host-context(html.app-dark) .session-loading__card span { color: #9db4d4; }
    `]
})
export class AppComponent {
    readonly auth = inject(AuthService);
    private readonly layoutService = inject(LayoutService);

    constructor() {
        this.layoutService.toggleDarkMode();
    }
}
