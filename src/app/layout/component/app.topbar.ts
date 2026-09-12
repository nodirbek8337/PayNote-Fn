import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppTopMenu } from './app-topmenu';
import { LayoutService } from '../service/layout.service';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AppTopMenu,
    ConfirmDialogModule,
    MenuModule
  ],
  providers: [ConfirmationService],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-container">
        <div>
          <a class="layout-topbar-logo" routerLink="/cabinet">
            <img src="assets/images/logo.png" alt="Pay Note" class="logo-content" width="77" height="40" />
          </a>
        </div>

        <app-topmenu class="menu-n"></app-topmenu>

        <div class="layout-topbar-actions">
          <div class="layout-topbar-menu">
            <div class="layout-topbar-menu-content">
              <button
                type="button"
                class="user-menu-trigger"
                aria-label="Foydalanuvchi menyusini ochish"
                aria-haspopup="menu"
                (click)="userMenu.toggle($event)"
              >
                <span class="user-avatar"><i class="pi pi-user"></i></span>
                <span class="user-name">{{ userName }}</span>
                <i class="pi pi-chevron-down user-menu-chevron"></i>
              </button>
              <p-menu #userMenu [model]="userMenuItems" [popup]="true" appendTo="body" styleClass="user-menu-panel"></p-menu>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p-confirmDialog styleClass="paynote-confirm-dialog"></p-confirmDialog>
  `,
  styles: [`
    ::ng-deep .user-select .p-select {
      min-width: 132px;
      height: 44px;
      display: flex;
      align-items: center;
      padding: 0 0.25rem 0 0.55rem;
      border-radius: 10px;
      border: 1px solid color-mix(in srgb, var(--action-primary) 38%, var(--surface-border)) !important;
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 68%, transparent) 0%, color-mix(in srgb, var(--table-bg) 90%, transparent) 100%) !important;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.03),
        0 10px 20px color-mix(in srgb, var(--action-primary) 10%, transparent);
      transition: border-color .18s ease, box-shadow .18s ease, background-color .18s ease;
    }
    ::ng-deep .user-select .p-select:hover {
      border-color: color-mix(in srgb, var(--action-primary-hover-from) 52%, var(--surface-border)) !important;
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 76%, transparent) 0%, color-mix(in srgb, var(--table-bg) 94%, transparent) 100%) !important;
    }
    ::ng-deep .user-select .p-select.p-focus,
    ::ng-deep .user-select .p-select:focus-within {
      border-color: color-mix(in srgb, var(--action-primary-hover-from) 78%, white 8%) !important;
      box-shadow: var(--focus-primary), 0 10px 20px color-mix(in srgb, var(--action-primary) 14%, transparent) !important;
    }
    ::ng-deep .user-select .p-select-label {
      display: flex;
      align-items: center;
      height: 100%;
      color: var(--text-color);
      font-weight: 600;
      padding-right: 0.35rem;
    }
    ::ng-deep .user-select .p-select-dropdown {
      width: 2rem;
      color: var(--text-color-secondary);
    }
    ::ng-deep .user-select .p-select-dropdown .pi {
      font-size: 0.85rem;
    }
    ::ng-deep .user-select-panel {
      min-width: 132px !important;
      border-radius: 10px !important;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--action-primary) 26%, var(--surface-border)) !important;
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 54%, transparent) 0%, color-mix(in srgb, var(--table-bg) 96%, transparent) 100%) !important;
      box-shadow: 0 18px 36px rgba(0, 0, 0, 0.34) !important;
    }
    ::ng-deep .user-select-panel .p-select-option {
      padding: 0.8rem 0.95rem !important;
      font-weight: 600;
    }
    .user-menu-option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .user-menu-option i {
      width: 1rem;
      color: var(--text-color-secondary);
      font-size: 0.85rem;
    }
    .logout-option {
      color: var(--action-delete-text);
    }
    .logout-option i {
      color: var(--action-delete-text);
    }
    ::ng-deep .user-select-panel .p-select-option:has(.logout-option) {
      margin-top: 0.3rem;
      border-top: 1px solid color-mix(in srgb, var(--action-delete-text) 22%, transparent);
      background: var(--action-delete-bg) !important;
    }
    ::ng-deep .user-select-panel .p-select-option:has(.logout-option):hover {
      background: color-mix(in srgb, var(--action-delete-bg) 72%, var(--action-delete-text) 28%) !important;
      color: var(--action-delete-hover) !important;
    }
    ::ng-deep .user-select-panel .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
      background: color-mix(in srgb, var(--action-primary-soft) 90%, transparent) !important;
      color: var(--text-color) !important;
    }

    @media (max-width: 991px) {
      ::ng-deep .user-select .p-select {
        min-width: 148px;
        max-width: 46vw;
      }

      ::ng-deep .user-select-panel {
        min-width: min(260px, calc(100vw - 24px)) !important;
      }
    }

    @media (max-width: 420px) {
      ::ng-deep .user-select .p-select {
        min-width: 132px;
        height: 40px;
      }
    }

    .user-menu-trigger {
      min-width: 142px;
      height: 42px;
      display: flex;
      align-items: center;
      gap: .55rem;
      padding: .3rem .55rem .3rem .35rem;
      border: 1px solid color-mix(in srgb, var(--action-primary) 38%, var(--surface-border));
      border-radius: 10px;
      background: linear-gradient(180deg, var(--table-head-from), var(--table-bg));
      color: var(--text-color);
      cursor: pointer;
    }
    .user-menu-trigger:hover,
    .user-menu-trigger:focus-visible {
      border-color: var(--action-primary-from);
      box-shadow: var(--focus-primary);
      outline: none;
    }
    .user-avatar {
      width: 30px;
      height: 30px;
      flex: 0 0 30px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: var(--action-primary-soft);
      color: var(--action-primary-from);
    }
    .user-name {
      min-width: 0;
      flex: 1;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 700;
    }
    .user-menu-chevron {
      color: var(--text-color-secondary);
      font-size: .75rem;
    }
    ::ng-deep .user-menu-panel {
      min-width: 190px !important;
      margin-top: .4rem;
      padding: .35rem !important;
      border: 1px solid var(--surface-border) !important;
      border-radius: 10px !important;
      background: var(--surface-card) !important;
      box-shadow: 0 18px 36px rgba(0, 0, 0, .34) !important;
    }
    ::ng-deep .user-menu-panel .p-menu-item-link {
      gap: .65rem;
      padding: .72rem .8rem !important;
      border-radius: 8px;
    }
    ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-link,
    ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-icon {
      color: var(--action-delete-text) !important;
    }
    ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-content:hover {
      background: var(--action-delete-bg) !important;
    }
    @media (max-width: 420px) {
      .user-menu-trigger {
        min-width: 128px;
        max-width: 48vw;
        height: 40px;
      }
    }
  `]
})
export class AppTopbar implements OnInit, OnDestroy {
  userName = this.getUserName();
  userMenuItems: MenuItem[] = [];

  private mediaQuery?: MediaQueryList;
  private mqListener?: (e: MediaQueryListEvent) => void;
  isXs = false;

  constructor(
    public layoutService: LayoutService,
    private confirmation: ConfirmationService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mediaQuery = window.matchMedia('(max-width: 991px)');
      this.isXs = this.mediaQuery.matches;

      this.mqListener = (e: MediaQueryListEvent) => {
        this.isXs = e.matches;
        this.refreshUserMenuItems();
      };

      if ('addEventListener' in this.mediaQuery) {
        this.mediaQuery.addEventListener('change', this.mqListener);
      } else {
        // @ts-ignore
        this.mediaQuery.addListener(this.mqListener);
      }
    }

    this.refreshUserMenuItems();
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mqListener) {
      if ('removeEventListener' in this.mediaQuery) {
        this.mediaQuery.removeEventListener('change', this.mqListener);
      } else {
        // @ts-ignore
        this.mediaQuery.removeListener(this.mqListener);
      }
    }
  }

  private refreshUserMenuItems(): void {
    const mobileItems: MenuItem[] = this.isXs
      ? [
          { label: 'Kabinet', icon: 'pi pi-chart-bar', routerLink: '/cabinet' },
          { label: 'Sotuv', icon: 'pi pi-shopping-cart', routerLink: '/sales' },
          ...(this.authService.isAdmin()
            ? [
                { label: 'Ombor', icon: 'pi pi-warehouse', routerLink: '/inventory' },
                { label: 'Maxsulotlar', icon: 'pi pi-box', routerLink: '/products' },
                { label: 'Tarix', icon: 'pi pi-history', routerLink: '/sales-history' },
                { label: 'Foydalanuvchilar', icon: 'pi pi-users', routerLink: '/users' }
              ]
            : []),
          { separator: true }
        ]
      : [];

    this.userMenuItems = [
      ...mobileItems,
      {
        label: 'Tizimdan chiqish',
        icon: 'pi pi-sign-out',
        styleClass: 'logout-menu-item',
        command: () => this.confirmLogout()
      }
    ];
  }

  private confirmLogout(): void {
    this.confirmation.confirm({
      header: 'Tizimdan chiqish?',
      message: 'Haqiqatan ham tizimdan chiqasizmi?',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Chiqish',
      rejectLabel: 'Bekor qilish',
      acceptButtonStyleClass: 'confirm-accept-btn',
      rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
      accept: () => this.logout()
    });
  }

  logout() {
    try {
      this.authService.logout();
    } finally {
      this.router.navigate(['/login']);
    }
  }

  private getUserName(): string {
    try {
      const raw = localStorage.getItem('payNoteUser');
      if (raw) {
        const user = JSON.parse(raw);
        return user?.username || 'Profile';
      }
    } catch {}
    return 'Profile';
  }
}
