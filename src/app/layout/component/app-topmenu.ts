import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

type MenuItem = { label: string; icon: string; routerLink: any[]; exact: boolean };
type MenuGroup = { key: string; label: string; icon: string; items: MenuItem[] };

@Component({
  selector: 'app-topmenu',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf],
  template: `
    <ul class="topmenu flex items-center gap-2 list-none p-0 m-0">
      <li *ngFor="let item of items">
        <a [routerLink]="item.routerLink" routerLinkActive #rla="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: item.exact }" [class.topmenu-active]="rla.isActive"
          class="topmenu-link flex items-center gap-2 px-3 py-2 rounded-md">
          <i [class]="item.icon"></i><span>{{ item.label }}</span>
        </a>
      </li>

      <li *ngFor="let group of groups" class="topmenu-group" [class.is-open]="openedGroup === group.key">
        <button type="button" class="topmenu-link topmenu-group__button flex items-center gap-2 px-3 py-2 rounded-md"
          [class.topmenu-active]="groupIsActive(group)" (click)="toggleGroup(group.key)" [attr.aria-expanded]="openedGroup === group.key">
          <i [class]="group.icon"></i><span>{{ group.label }}</span><i class="pi pi-chevron-down group-chevron"></i>
        </button>
        <div class="topmenu-dropdown" *ngIf="openedGroup === group.key">
          <a *ngFor="let item of group.items" [routerLink]="item.routerLink" routerLinkActive #rla="routerLinkActive"
            [routerLinkActiveOptions]="{ exact: item.exact }" [class.topmenu-dropdown__active]="rla.isActive"
            class="topmenu-dropdown__item" (click)="closeGroups()">
            <i [class]="item.icon"></i><span>{{ item.label }}</span>
          </a>
        </div>
      </li>

      <li *ngFor="let item of endItems">
        <a [routerLink]="item.routerLink" routerLinkActive #rla="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: item.exact }" [class.topmenu-active]="rla.isActive"
          class="topmenu-link flex items-center gap-2 px-3 py-2 rounded-md">
          <i [class]="item.icon"></i><span>{{ item.label }}</span>
        </a>
      </li>
    </ul>
  `,
  styles: [`
    .topmenu { background: linear-gradient(180deg, color-mix(in srgb, var(--table-head-from) 70%, #0d1b2f 30%) 0%, color-mix(in srgb, #0d1b2f 88%, var(--action-primary) 12%) 100%); border: 1px solid color-mix(in srgb, var(--surface-border), transparent 8%); border-radius: 8px; padding: .25rem !important; box-shadow: 0 8px 20px rgba(0,0,0,.16); }
    .topmenu-link { color: var(--text-color-secondary); text-decoration: none; border-radius: 8px; font-weight: 700; border: 1px solid transparent; background: transparent; cursor: pointer; transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out; }
    .topmenu-link:hover, .topmenu-group.is-open .topmenu-group__button { color: #b8c7df; background-color: rgba(79,140,255,.10); border-color: rgba(117,166,255,.26); }
    .topmenu-active { color: #b8c7df !important; background: rgba(79,140,255,.14); border-color: rgba(117,166,255,.44); box-shadow: inset 0 0 0 1px rgba(117,166,255,.12); font-weight: 800; }
    .topmenu-group { position: relative; }
    .group-chevron { font-size: .68rem; margin-left: .1rem; transition: transform .15s ease; }
    .is-open .group-chevron { transform: rotate(180deg); }
    .topmenu-dropdown { position: absolute; z-index: 1100; top: calc(100% + .5rem); left: 0; min-width: 190px; padding: .35rem; border: 1px solid #294c7c; border-radius: 9px; background: #0d2039; box-shadow: 0 15px 30px rgba(0,0,0,.35); }
    .topmenu-dropdown__item { display: flex; align-items: center; gap: .65rem; padding: .65rem .75rem; border-radius: 6px; color: #b8c7df; font-weight: 650; font-size: .9rem; text-decoration: none; white-space: nowrap; }
    .topmenu-dropdown__item:hover, .topmenu-dropdown__active { color: #e6f0ff; background: rgba(79,140,255,.18); }
    .topmenu-dropdown__item i { color: #83adf7; width: 1rem; }
    .topmenu-link:focus-visible { outline: 2px solid color-mix(in srgb, var(--primary-color), transparent 60%); outline-offset: 2px; }
  `]
})
export class AppTopMenu implements OnInit {
  private authService = inject(AuthService); private router = inject(Router); private host = inject(ElementRef<HTMLElement>);
  items: MenuItem[] = []; groups: MenuGroup[] = []; endItems: MenuItem[] = []; openedGroup: string | null = null;

  ngOnInit(): void {
    const cabinet: MenuItem = { label: 'Kabinet', icon: 'pi pi-chart-bar', routerLink: ['/cabinet'], exact: true };
    const fridge: MenuGroup = { key: 'fridge', label: 'Muzlatgich', icon: 'pi pi-box', items: [
      { label: 'Sotuv', icon: 'pi pi-shopping-cart', routerLink: ['/sales'], exact: true },
      { label: 'Ombor', icon: 'pi pi-warehouse', routerLink: ['/inventory'], exact: true },
      { label: 'Mahsulotlar', icon: 'pi pi-box', routerLink: ['/products'], exact: true },
      { label: 'Tarix', icon: 'pi pi-history', routerLink: ['/sales-history'], exact: true },
    ] };
    const hotel: MenuGroup = { key: 'hotel', label: 'Mehmonxona', icon: 'pi pi-building', items: [
      { label: 'Xonalar', icon: 'pi pi-building', routerLink: ['/hotel/rooms'], exact: true },
      { label: 'Buyurtmalar', icon: 'pi pi-calendar-plus', routerLink: ['/hotel'], exact: true },
      { label: 'Hisob-kitob tarixi', icon: 'pi pi-history', routerLink: ['/hotel/history'], exact: true },
    ] };
    if (this.authService.isAdmin()) {
      this.items = [cabinet]; this.groups = [hotel, fridge];
      this.endItems = [{ label: 'Foydalanuvchilar', icon: 'pi pi-users', routerLink: ['/users'], exact: true }];
      return;
    }
    this.items = [cabinet]; this.groups = this.authService.canUseHotel() ? [{ ...hotel, items: hotel.items.slice(1, 2) }] : [{ ...fridge, items: fridge.items.slice(0, 1) }];
  }

  toggleGroup(key: string) { this.openedGroup = this.openedGroup === key ? null : key; }
  closeGroups() { this.openedGroup = null; }
  groupIsActive(group: MenuGroup) { return group.items.some(item => this.router.url === item.routerLink.join('/')); }
  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent) { if (!this.host.nativeElement.contains(event.target as Node)) this.closeGroups(); }
  @HostListener('document:keydown.escape') onEscape() { this.closeGroups(); }
}
