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
    .topmenu-link {
      color: var(--text-color);
      text-decoration: none;
      transition: color .15s ease-in-out, background-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }
    .topmenu-link:hover {
      color: var(--primary-color);
      background-color: color-mix(in srgb, var(--primary-color), transparent 90%);
    }

    .topmenu-active {
      color: var(--primary-color) !important;
      background-color: color-mix(in srgb, var(--primary-color), transparent 85%);
      box-shadow: inset 0 1px 0 color-mix(in srgb, var(--primary-color), transparent 70%);
      font-weight: 600;
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
      { label: 'Contacts', icon: 'pi pi-address-book', routerLink: ['/'],      exact: true  },
      { label: 'Users',    icon: 'pi pi-user',         routerLink: ['/users'], exact: true  },
    ];
  }
}
