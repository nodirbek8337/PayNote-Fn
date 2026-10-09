import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { LayoutService } from '../service/layout.service';

type MenuItem = { label: string; icon: string; routerLink: any[]; exact: boolean };
type MenuGroup = { key: string; label: string; icon: string; items: MenuItem[] };

@Component({
    selector: 'app-topmenu',
    standalone: true,
    imports: [RouterModule],
    template: `
        <ul class="topmenu flex items-center gap-2 list-none p-0 m-0">
            @for (item of items; track item) {
                <li>
                    <a [routerLink]="item.routerLink" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]="{ exact: item.exact }" [class.topmenu-active]="rla.isActive" [attr.title]="item.label" class="topmenu-link flex items-center gap-2 px-3 py-2 rounded-md">
                        <i [class]="item.icon"></i><span>{{ item.label }}</span>
                    </a>
                </li>
            }

            @for (group of groups; track group) {
                <li class="topmenu-group" [class.is-open]="openedGroup === group.key">
                    <button
                        type="button"
                        class="topmenu-link topmenu-group__button flex items-center gap-2 px-3 py-2 rounded-md"
                        [class.topmenu-active]="groupIsActive(group)"
                        (click)="toggleGroup(group.key)"
                        [attr.aria-expanded]="openedGroup === group.key"
                        [attr.title]="group.label"
                    >
                        <i [class]="group.icon"></i><span>{{ group.label }}</span
                        ><i class="pi pi-chevron-down group-chevron"></i>
                    </button>
                    <div class="topmenu-dropdown" [class.is-visible]="openedGroup === group.key" [attr.aria-hidden]="openedGroup !== group.key">
                        @for (item of group.items; track item) {
                            <a
                                [routerLink]="item.routerLink"
                                routerLinkActive
                                #rla="routerLinkActive"
                                [routerLinkActiveOptions]="{ exact: item.exact }"
                                [class.topmenu-dropdown__active]="rla.isActive"
                                [attr.title]="item.label"
                                class="topmenu-dropdown__item"
                            >
                                <i [class]="item.icon"></i><span>{{ item.label }}</span>
                            </a>
                        }
                    </div>
                </li>
            }

            @for (item of endItems; track item) {
                <li>
                    <a [routerLink]="item.routerLink" routerLinkActive #rla="routerLinkActive" [routerLinkActiveOptions]="{ exact: item.exact }" [class.topmenu-active]="rla.isActive" [attr.title]="item.label" class="topmenu-link flex items-center gap-2 px-3 py-2 rounded-md">
                        <i [class]="item.icon"></i><span>{{ item.label }}</span>
                    </a>
                </li>
            }
        </ul>
    `,
    styles: [
        `
            .topmenu {
                background: #f4f8fd;
                border: 1px solid #dce7f4;
                border-radius: 11px;
                padding: 0.25rem !important;
                box-shadow: 0 7px 20px rgba(42, 79, 126, 0.06);
            }
            .topmenu-link {
                color: #607695;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 700;
                border: 1px solid transparent;
                background: transparent;
                cursor: pointer;
                transition:
                    color 0.15s ease-in-out,
                    background-color 0.15s ease-in-out,
                    border-color 0.15s ease-in-out;
            }
            .topmenu-link:hover,
            .topmenu-group.is-open .topmenu-group__button {
                color: #116bdc;
                background-color: #e8f2ff;
                border-color: #c8ddf8;
            }
            .topmenu-active {
                color: #ffffff !important;
                background: linear-gradient(135deg, #2585ff, #116bdc);
                border-color: #116bdc;
                box-shadow: 0 7px 16px rgba(17, 107, 220, .2);
                font-weight: 800;
            }
            .topmenu-group {
                position: relative;
            }
            .group-chevron {
                font-size: 0.68rem;
                margin-left: 0.1rem;
                transition: transform 0.15s ease;
            }
            .is-open .group-chevron {
                transform: rotate(180deg);
            }
            .topmenu-dropdown {
                position: absolute;
                z-index: 1100;
                top: calc(100% + 0.5rem);
                left: 0;
                min-width: 190px;
                padding: 0.35rem;
                border: 1px solid #d9e5f3;
                border-radius: 11px;
                background: #ffffff;
                box-shadow: 0 18px 38px rgba(39, 73, 116, 0.16);
            }
            .topmenu-dropdown__item {
                display: flex;
                align-items: center;
                gap: 0.65rem;
                padding: 0.65rem 0.75rem;
                border-radius: 6px;
                color: #526a8d;
                font-weight: 650;
                font-size: 0.9rem;
                text-decoration: none;
                white-space: nowrap;
            }
            .topmenu-dropdown__item:hover,
            .topmenu-dropdown__active {
                color: #116bdc;
                background: #edf5ff;
            }
            .topmenu-dropdown__item i {
                color: #2585ff;
                width: 1rem;
            }
            .topmenu-link:focus-visible {
                outline: 2px solid color-mix(in srgb, var(--primary-color), transparent 60%);
                outline-offset: 2px;
            }

            :host { display: block; min-width: 0; }
            .topmenu {
                width: 100%;
                display: flex !important;
                flex-direction: column !important;
                align-items: stretch !important;
                gap: .35rem !important;
                border: 0;
                border-radius: 0;
                background: transparent;
                box-shadow: none;
            }
            .topmenu > li { width: 100%; }
            .topmenu-link {
                width: 100%;
                min-height: 44px;
                justify-content: flex-start;
                box-sizing: border-box;
                padding: .7rem .8rem !important;
                border-radius: 10px;
            }
            .topmenu-link > i:first-child { width: 22px; height: 22px; display: grid; flex: 0 0 22px; place-items: center; text-align: center; color: #3987e9; font-size: .9rem; }
            .topmenu-active > i:first-child { color: #fff; }
            .topmenu-group__button .group-chevron { margin-left: auto; }
            .topmenu-dropdown {
                position: static;
                min-width: 0;
                max-height: 0;
                margin: 0;
                padding: 0;
                border: 0;
                border-radius: 0;
                background: transparent;
                box-shadow: none;
                overflow: hidden;
                opacity: 0;
                pointer-events: none;
                transform: translateY(-5px);
                transition: max-height .26s ease, margin .26s ease, padding .26s ease, opacity .18s ease, transform .26s ease;
            }
            .topmenu-dropdown.is-visible { max-height: 320px; margin: .28rem 0 .28rem .4rem; padding: .1rem .15rem .1rem .5rem; opacity: 1; pointer-events: auto; transform: translateY(0); }
            .topmenu-dropdown__item { min-height: 38px; margin: .18rem 0; padding: .55rem .7rem; border: 1px solid transparent; border-radius: 9px; }
            .topmenu-dropdown__item:hover,
            .topmenu-dropdown__active { border-color: #d6e6f7; background: #eef6ff; }

            :host-context(html.app-dark) .topmenu-link { color: #aebed5; }
            :host-context(html.app-dark) .topmenu-link > i:first-child { color: #79adff; }
            :host-context(html.app-dark) .topmenu-link:hover,
            :host-context(html.app-dark) .topmenu-group.is-open .topmenu-group__button { color: #e5efff; background: #172d4d; border-color: #29466f; }
            :host-context(html.app-dark) .topmenu-active { color: #fff !important; background: linear-gradient(135deg, #397fe9, #245fc3); border-color: #4c8df0; }
            :host-context(html.app-dark) .topmenu-dropdown__item { color: #aebed5; }
            :host-context(html.app-dark) .topmenu-dropdown__item:hover,
            :host-context(html.app-dark) .topmenu-dropdown__active { color: #eef5ff; border-color: #294e78; background: #152f50; }
        `
    ]
})
export class AppTopMenu implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private layoutService = inject(LayoutService);
    items: MenuItem[] = [];
    groups: MenuGroup[] = [];
    endItems: MenuItem[] = [];
    openedGroup: string | null = null;

    ngOnInit(): void {
        const cabinet: MenuItem = { label: 'Kabinet', icon: 'pi pi-chart-bar', routerLink: ['/cabinet'], exact: true };
        const fridge: MenuGroup = {
            key: 'fridge',
            label: 'Muzlatgich',
            icon: 'pi pi-box',
            items: [
                { label: 'Sotuv', icon: 'pi pi-shopping-cart', routerLink: ['/sales'], exact: true },
                { label: 'Ombor', icon: 'pi pi-warehouse', routerLink: ['/inventory'], exact: true },
                { label: 'Mahsulotlar', icon: 'pi pi-box', routerLink: ['/products'], exact: true },
                { label: 'Tarix', icon: 'pi pi-history', routerLink: ['/sales-history'], exact: true }
            ]
        };
        const hotel: MenuGroup = {
            key: 'hotel',
            label: 'Mehmonxona',
            icon: 'pi pi-building',
            items: [
                { label: 'Xonalar', icon: 'pi pi-building', routerLink: ['/hotel/rooms'], exact: true },
                { label: 'Buyurtmalar', icon: 'pi pi-calendar-plus', routerLink: ['/hotel/bookings'], exact: true },
                { label: 'Buyurtmalar tarixi', icon: 'pi pi-history', routerLink: ['/hotel/history'], exact: true },
                { label: 'Chiqimlar tarixi', icon: 'pi pi-wallet', routerLink: ['/hotel/expenses'], exact: true },
                { label: 'Telegram hisobotlari', icon: 'pi pi-send', routerLink: ['/hotel/reports'], exact: true }
            ]
        };
        if (this.authService.isAdmin()) {
            this.items = [cabinet];
            this.groups = [hotel, fridge];
            this.endItems = [{ label: 'Foydalanuvchilar', icon: 'pi pi-users', routerLink: ['/users'], exact: true }];
            this.openedGroup = this.router.url.startsWith('/hotel') ? 'hotel' : this.router.url.startsWith('/sales') || this.router.url.startsWith('/inventory') || this.router.url.startsWith('/products') ? 'fridge' : null;
            return;
        }
        this.items = [cabinet];
        this.groups = [
            ...(this.authService.canUseHotel() ? [{ ...hotel, items: hotel.items.slice(1, 4) }] : []),
            ...(this.authService.canUseFridge() ? [{ ...fridge, items: fridge.items.slice(0, 1) }] : [])
        ];
        this.openedGroup = this.router.url.startsWith('/hotel') ? 'hotel' : this.router.url.startsWith('/sales') || this.router.url.startsWith('/inventory') || this.router.url.startsWith('/products') ? 'fridge' : null;
    }

    toggleGroup(key: string) {
        if (this.layoutService.sidebarCollapsed()) {
            this.layoutService.setSidebarCollapsed(false);
            this.openedGroup = key;
            return;
        }
        this.openedGroup = this.openedGroup === key ? null : key;
    }
    closeGroups() {
        this.openedGroup = null;
    }
    groupIsActive(group: MenuGroup) {
        return group.items.some((item) => this.router.url === item.routerLink.join('/'));
    }
    @HostListener('document:keydown.escape') onEscape() {
        this.closeGroups();
    }
}
