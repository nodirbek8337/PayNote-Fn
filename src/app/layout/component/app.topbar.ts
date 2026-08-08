import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppTopMenu } from './app-topmenu';
import { LayoutService } from '../service/layout.service';

import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../shared/services/auth.service';

type SelectValue =
  | { type: 'logout' }
  | { type: 'route'; url: string };

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    AppTopMenu,
    FormsModule,
    ConfirmDialogModule,
    SelectModule
  ],
  providers: [ConfirmationService],
  template: `
    <div class="layout-topbar">
      <div class="layout-topbar-container">
        <div>
          <a class="layout-topbar-logo" routerLink="/sales">
            <img src="assets/images/logo.png" alt="Pay Note" class="logo-content" />
          </a>
        </div>

        <app-topmenu class="menu-n"></app-topmenu>

        <div class="layout-topbar-actions">
          <div class="layout-topbar-menu">
            <div class="layout-topbar-menu-content flex items-center gap-3">
              <p-select
                [options]="selectOptions"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="selectedOption"
                [placeholder]="userName"
                (onChange)="onUserAction($event)"
                styleClass="user-select"
                panelStyleClass="user-select-panel"
              ></p-select>
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
  `]
})
export class AppTopbar implements OnInit, OnDestroy {
  items!: MenuItem[];

  userName = this.getUserName();

  private baseOptions = [
    { label: 'Tizimdan chiqish', value: { type: 'logout' } as SelectValue }
  ];

  private mobileNavOptions = [
    { label: 'Sotuv', value: { type: 'route', url: '/sales' } as SelectValue },
    { label: 'Ombor', value: { type: 'route', url: '/inventory' } as SelectValue },
    { label: 'Maxsulotlar', value: { type: 'route', url: '/products' } as SelectValue },
    { label: 'Tarix', value: { type: 'route', url: '/sales-history' } as SelectValue },
    { label: 'Foydalanuvchilar', value: { type: 'route', url: '/users' } as SelectValue }
  ];

  get selectOptions() {
    return this.isXs ? [...this.mobileNavOptions, ...this.baseOptions] : this.baseOptions;
  }

  selectedOption: SelectValue | null = null;

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
        if (!this.isXs && this.selectedOption && this.selectedOption.type === 'route') {
          this.selectedOption = null;
        }
      };

      if ('addEventListener' in this.mediaQuery) {
        this.mediaQuery.addEventListener('change', this.mqListener);
      } else {
        // @ts-ignore
        this.mediaQuery.addListener(this.mqListener);
      }
    }
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

  onUserAction(event: any) {
    const val = event?.value as SelectValue | undefined;
    if (!val) return;

    if (val.type === 'logout') {
      this.confirmation.confirm({
        header: 'Tizimdan chiqish?',
        message: 'Haqiqatan ham tizimdan chiqasizmi?',
        icon: 'pi pi-sign-out',
        acceptLabel: 'Chiqish',
        rejectLabel: 'Bekor qilish',
        acceptButtonStyleClass: 'confirm-accept-btn',
        rejectButtonStyleClass: 'p-button-outlined confirm-reject-btn',
        accept: () => this.logout(),
        reject: () => { this.selectedOption = null; }
      });
      return;
    }

    if (val.type === 'route') {
      this.router.navigate([val.url]).finally(() => {
        this.selectedOption = null;
      });
      return;
    }
  }

  logout() {
    try {
      this.authService.logout();
    } finally {
      this.selectedOption = null;
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
