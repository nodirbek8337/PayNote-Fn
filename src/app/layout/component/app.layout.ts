import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppTopMenu } from './app-topmenu';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppTopMenu, RouterModule],
    template: `
        <div class="layout-wrapper layout-full" [ngClass]="containerClass">
            <app-topbar></app-topbar>

            <aside class="layout-sidebar-shell" aria-label="Asosiy navigatsiya">
                <app-topmenu></app-topmenu>
                <div class="layout-sidebar-shell__footer">
                    <b>EsEsUc</b>
                    <small>Every stay, under control.</small>
                </div>
            </aside>

            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `
})
export class AppLayout {
    layoutService = inject(LayoutService);

    get containerClass() {
        return {
            'layout-full': true,
            'layout-sidebar-collapsed': this.layoutService.sidebarCollapsed()
        };
    }
}
