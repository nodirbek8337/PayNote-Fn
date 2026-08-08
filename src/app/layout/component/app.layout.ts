import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule],
    template: `
        <div class="layout-wrapper layout-full" [ngClass]="containerClass">
            <app-topbar></app-topbar>

            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `
})
export class AppLayout {
    constructor(public layoutService: LayoutService) {}

    get containerClass() {
        return { 'layout-full': true };
    }
}
