import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topmenu',
  standalone: true,
  imports: [RouterModule, NgFor],
  template: `
    <ul class="flex items-center gap-2 list-none p-0 m-0">
      <li *ngFor="let item of items">
        <a
          [routerLink]="item.routerLink"
          routerLinkActive
          #rla="routerLinkActive"
          [routerLinkActiveOptions]="{ exact: item.exact }"
          [class.topmenu-active]="rla.isActive"
          class="topmenu-link flex items-center gap-2 px-3 py-2 rounded-md"
        >
          <i [class]="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </li>
    </ul>
  `,
  styles: [`
    ul {
      background: color-mix(in srgb, var(--surface-card), transparent 8%);
      border: 1px solid color-mix(in srgb, var(--surface-border), transparent 18%);
      border-radius: 8px;
      padding: 0.25rem !important;
      box-shadow: 0 8px 22px rgba(0, 0, 0, 0.20);
    }
    .topmenu-link {
      color: var(--text-color-secondary);
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      border: 1px solid transparent;
      transition: color .15s ease-in-out, background-color .15s ease-in-out, box-shadow .15s ease-in-out, transform .15s ease-in-out;
    }
    .topmenu-link:hover {
      color: #b8c7df;
      background-color: rgba(79, 140, 255, 0.10);
      border-color: rgba(117, 166, 255, 0.26);
    }

    .topmenu-active {
      color: #b8c7df !important;
      background: rgba(79, 140, 255, 0.14);
      border-color: rgba(117, 166, 255, 0.44);
      box-shadow: inset 0 0 0 1px rgba(117, 166, 255, 0.12);
      font-weight: 800;
    }

    .topmenu-link:focus-visible {
      outline: 2px solid color-mix(in srgb, var(--primary-color), transparent 60%);
      outline-offset: 2px;
    }
  `]
})
export class AppTopMenu implements OnInit {
  items: Array<{ label: string; icon: string; routerLink: any[]; exact: boolean }> = [];

  ngOnInit(): void {
    this.items = [
      { label: 'Ombor', icon: 'pi pi-warehouse', routerLink: ['/inventory'], exact: true },
      { label: 'Maxsulotlar', icon: 'pi pi-box', routerLink: ['/products'], exact: true },
      { label: 'Foydalanuvchilar', icon: 'pi pi-users', routerLink: ['/users'], exact: true },
    ];
  }
}
