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
          <a class="layout-topbar-logo" routerLink="/">
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
              ></p-select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p-confirmDialog></p-confirmDialog>
  `,
  styles: [`
    ::ng-deep .user-select .p-select {
      height: 40px;
      display: flex;
      align-items: center;
    }
    ::ng-deep .user-select .p-select-label {
      display: flex;
      align-items: center;
      height: 100%;
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
    { label: 'Kontaktlar', value: { type: 'route', url: '/' } as SelectValue },
    { label: 'Foydalanuvchilar',    value: { type: 'route', url: '/users' }    as SelectValue }
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
    private router: Router
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      this.mediaQuery = window.matchMedia('(max-width: 540px)');
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
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Chiqish',
        rejectLabel: 'Ortga',
        acceptButtonStyleClass: 'p-button-danger',
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
      localStorage.clear();
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
