import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';

import { AppTopMenu } from './app-topmenu';
import { LayoutService } from '../service/layout.service';

import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, AppTopMenu, ConfirmDialog, MenuModule],
    providers: [ConfirmationService],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-container">
                <div>
                    <a class="layout-topbar-logo" routerLink="/cabinet">
                        <img src="assets/images/logo.png" alt="Pay Note" class="logo-content" width="77" height="40" />
                    </a>
                </div>

                <app-topmenu class="desktop-topmenu"></app-topmenu>

                <div class="mobile-navigation">
                    <button type="button" class="mobile-navigation__trigger" aria-label="Asosiy menyuni ochish" aria-haspopup="menu" (click)="mobileMenu.toggle($event)">
                        <i class="pi pi-bars"></i><span>Menyu</span>
                    </button>
                    <p-menu #mobileMenu [model]="mobileMenuItems" [popup]="true" appendTo="body" styleClass="mobile-navigation__panel"></p-menu>
                </div>

                <div class="layout-topbar-actions">
                    <div class="layout-topbar-menu">
                        <div class="layout-topbar-menu-content">
                            <button type="button" class="user-menu-trigger" aria-label="Foydalanuvchi menyusini ochish" aria-haspopup="menu" (click)="userMenu.toggle($event)">
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

        <p-confirmdialog styleClass="paynote-confirm-dialog"></p-confirmdialog>
    `,
    styles: [
        `
            ::ng-deep .user-select .p-select {
                min-width: 132px;
                height: 44px;
                display: flex;
                align-items: center;
                padding: 0 0.25rem 0 0.55rem;
                border-radius: 10px;
                border: 1px solid color-mix(in srgb, var(--action-primary) 38%, var(--surface-border)) !important;
                background: linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 68%, transparent) 0%, color-mix(in srgb, var(--table-bg) 90%, transparent) 100%) !important;
                box-shadow:
                    inset 0 1px 0 rgba(255, 255, 255, 0.03),
                    0 10px 20px color-mix(in srgb, var(--action-primary) 10%, transparent);
                transition:
                    border-color 0.18s ease,
                    box-shadow 0.18s ease,
                    background-color 0.18s ease;
            }
            ::ng-deep .user-select .p-select:hover {
                border-color: color-mix(in srgb, var(--action-primary-hover-from) 52%, var(--surface-border)) !important;
                background: linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 76%, transparent) 0%, color-mix(in srgb, var(--table-bg) 94%, transparent) 100%) !important;
            }
            ::ng-deep .user-select .p-select.p-focus,
            ::ng-deep .user-select .p-select:focus-within {
                border-color: color-mix(in srgb, var(--action-primary-hover-from) 78%, white 8%) !important;
                box-shadow:
                    var(--focus-primary),
                    0 10px 20px color-mix(in srgb, var(--action-primary) 14%, transparent) !important;
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
                background: linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 54%, transparent) 0%, color-mix(in srgb, var(--table-bg) 96%, transparent) 100%) !important;
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
                gap: 0.55rem;
                padding: 0.3rem 0.55rem 0.3rem 0.35rem;
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
                font-size: 0.75rem;
            }
            ::ng-deep .user-menu-panel {
                min-width: 190px !important;
                margin-top: 0.4rem;
                padding: 0.35rem !important;
                border: 1px solid var(--surface-border) !important;
                border-radius: 10px !important;
                background: var(--surface-card) !important;
                box-shadow: 0 18px 36px rgba(0, 0, 0, 0.34) !important;
            }
            ::ng-deep .user-menu-panel .p-menu-item-link {
                gap: 0.65rem;
                padding: 0.72rem 0.8rem !important;
                border-radius: 8px;
            }
            ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-link,
            ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-icon {
                color: var(--action-delete-text) !important;
            }
            ::ng-deep .user-menu-panel .logout-menu-item .p-menu-item-content:hover {
                background: var(--action-delete-bg) !important;
            }
            .mobile-navigation {
                display: none;
            }
            .mobile-navigation__trigger {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                min-width: 92px;
                height: 40px;
                padding: 0 0.75rem;
                border: 1px solid color-mix(in srgb, var(--action-primary) 38%, var(--surface-border));
                border-radius: 9px;
                background: var(--table-head-from);
                color: var(--text-color);
                font-weight: 700;
                cursor: pointer;
            }
            .mobile-navigation__trigger:hover,
            .mobile-navigation__trigger:focus-visible {
                border-color: var(--action-primary-from);
                box-shadow: var(--focus-primary);
                outline: none;
            }
            ::ng-deep .mobile-navigation__panel {
                width: min(300px, calc(100vw - 24px)) !important;
                padding: 0.4rem !important;
                border: 1px solid var(--surface-border) !important;
                border-radius: 10px !important;
                background: var(--surface-card) !important;
                box-shadow: 0 18px 36px rgba(0, 0, 0, 0.34) !important;
            }
            ::ng-deep .mobile-navigation__panel .p-menu-item-link {
                gap: 0.75rem;
                padding: 0.8rem 0.85rem !important;
                border-radius: 7px;
                font-weight: 650;
            }
            ::ng-deep .mobile-navigation__panel .p-menu-item-link:focus-visible {
                outline: 2px solid var(--action-primary-from);
                outline-offset: -2px;
            }
            ::ng-deep .mobile-navigation__panel .mobile-logout-item {
                margin-top: 0;
            }
            ::ng-deep .mobile-navigation__panel .mobile-logout-item .p-menu-item-link,
            ::ng-deep .mobile-navigation__panel .mobile-logout-item .p-menu-item-icon {
                color: var(--action-delete-text) !important;
            }
            ::ng-deep .mobile-navigation__panel .mobile-logout-item .p-menu-item-content:hover {
                background: var(--action-delete-bg) !important;
            }
            ::ng-deep .mobile-navigation__panel .mobile-user-item,
            ::ng-deep .mobile-navigation__panel .mobile-user-item .p-menu-item-link,
            ::ng-deep .mobile-navigation__panel .mobile-user-item .p-menu-item-icon,
            ::ng-deep .mobile-navigation__panel .mobile-user-item.p-disabled {
                opacity: 1 !important;
                color: var(--action-primary-from) !important;
            }
            ::ng-deep .mobile-navigation__panel .mobile-user-item .p-menu-item-link {
                background: color-mix(in srgb, var(--action-primary-soft) 60%, transparent);
                font-weight: 800;
            }
            @media (max-width: 991px) {
                ::ng-deep .mobile-navigation__panel {
                    position: fixed !important;
                    inset: 4.5rem 0.5rem auto !important;
                    width: auto !important;
                    max-height: calc(100dvh - 5rem);
                    overflow-y: auto;
                }
                :host ::ng-deep .desktop-topmenu {
                    display: none;
                }
                .mobile-navigation {
                    display: block;
                    margin-left: auto;
                }
                .layout-topbar-actions {
                    display: none;
                }
                .layout-topbar-container {
                    justify-content: flex-start;
                }
            }
            @media (max-width: 420px) {
                .mobile-navigation__trigger {
                    min-width: 44px;
                    min-height: 44px;
                    padding: 0;
                }
                .mobile-navigation__trigger span {
                    display: none;
                }
                .user-menu-trigger {
                    min-width: 128px;
                    max-width: 48vw;
                    height: 40px;
                }
            }
        `
    ]
})
export class AppTopbar implements OnInit, OnDestroy {
    layoutService = inject(LayoutService);
    private confirmation = inject(ConfirmationService);
    private router = inject(Router);
    private authService = inject(AuthService);

    userMenuItems: MenuItem[] = [];
    mobileMenuItems: MenuItem[] = [];

    private mediaQuery?: MediaQueryList;
    private mqListener?: (e: MediaQueryListEvent) => void;
    isXs = false;

    ngOnInit(): void {
        if (typeof window !== 'undefined' && 'matchMedia' in window) {
            this.mediaQuery = window.matchMedia('(max-width: 991px)');
            this.isXs = this.mediaQuery.matches;

            this.mqListener = (e: MediaQueryListEvent) => {
                this.isXs = e.matches;
                this.refreshUserMenuItems();
                this.refreshMobileMenuItems();
            };

            if ('addEventListener' in this.mediaQuery) {
                this.mediaQuery.addEventListener('change', this.mqListener);
            } else {
                (this.mediaQuery as MediaQueryList & { addListener(listener: (event: MediaQueryListEvent) => void): void }).addListener(this.mqListener);
            }
        }

        this.refreshUserMenuItems();
        this.refreshMobileMenuItems();
    }

    ngOnDestroy(): void {
        if (this.mediaQuery && this.mqListener) {
            if ('removeEventListener' in this.mediaQuery) {
                this.mediaQuery.removeEventListener('change', this.mqListener);
            } else {
                (this.mediaQuery as MediaQueryList & { removeListener(listener: (event: MediaQueryListEvent) => void): void }).removeListener(this.mqListener);
            }
        }
    }

    private refreshUserMenuItems(): void {
        this.userMenuItems = [
            {
                label: 'Tizimdan chiqish',
                icon: 'pi pi-sign-out',
                styleClass: 'logout-menu-item',
                command: () => this.confirmLogout()
            }
        ];
    }

    private refreshMobileMenuItems(): void {
        const item = (label: string, icon: string, route: string): MenuItem => ({
            label,
            icon,
            command: () => void this.router.navigateByUrl(route)
        });
        const cabinet = item('Kabinet', 'pi pi-chart-bar', '/cabinet');
        const hotel = [
            item('Mehmonxona — Xonalar', 'pi pi-building', '/hotel/rooms'),
            item('Mehmonxona — Buyurtmalar', 'pi pi-calendar-plus', '/hotel/bookings'),
            item('Mehmonxona — Buyurtmalar tarixi', 'pi pi-history', '/hotel/history'),
            item('Mehmonxona — Chiqimlar tarixi', 'pi pi-wallet', '/hotel/expenses'),
            item('Mehmonxona — Telegram hisobotlari', 'pi pi-send', '/hotel/reports')
        ];
        const fridge = [
            item('Muzlatgich — Sotuv', 'pi pi-shopping-cart', '/sales'),
            item('Muzlatgich — Ombor', 'pi pi-warehouse', '/inventory'),
            item('Muzlatgich — Mahsulotlar', 'pi pi-box', '/products'),
            item('Muzlatgich — Sotuv tarixi', 'pi pi-history', '/sales-history')
        ];

        const navigationItems = this.authService.isAdmin()
            ? [cabinet, { separator: true }, ...hotel, { separator: true }, ...fridge, { separator: true }, item('Foydalanuvchilar', 'pi pi-users', '/users')]
            : [
                cabinet,
                ...(this.authService.canUseHotel() ? [{ separator: true }, ...hotel.slice(1, 4)] : []),
                ...(this.authService.canUseFridge() ? [{ separator: true }, fridge[0]] : [])
            ];

        this.mobileMenuItems = [
            ...navigationItems,
            { separator: true },
            { label: this.userName, icon: 'pi pi-user', disabled: true, styleClass: 'mobile-user-item' },
            { separator: true },
            { label: 'Tizimdan chiqish', icon: 'pi pi-sign-out', styleClass: 'mobile-logout-item', command: () => this.confirmLogout() }
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

    /** /auth/me dan yangilanadigan signal ishlatiladi, shuning uchun topbar darhol login nomini ko'rsatadi. */
    get userName(): string {
        return this.authService.currentUser()?.username || 'Foydalanuvchi';
    }
}
