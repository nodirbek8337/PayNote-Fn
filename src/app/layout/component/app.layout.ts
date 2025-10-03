import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppTopbar } from './app.topbar';
import { AppFooter } from './app.footer';
import { LayoutService } from '../service/layout.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, AppTopbar, RouterModule, AppFooter],
  template: `
    <div class="layout-wrapper layout-full" [ngClass]="containerClass">
      <app-topbar></app-topbar>

      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
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
