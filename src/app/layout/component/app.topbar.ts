import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppTopMenu } from './app-topmenu';
import { LayoutService } from '../service/layout.service';

import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';

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

        <app-topmenu></app-topmenu>

        <div class="layout-topbar-actions">
          <div class="layout-topbar-menu hidden lg:block">
            <div class="layout-topbar-menu-content flex items-center gap-3">
              <p-select
                [options]="userOptions"
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
export class AppTopbar {
  items!: MenuItem[];

  userName = this.getUserName();
  userOptions = [{ label: 'Logout', value: 'logout' }];
  selectedOption: string | null = null;

  constructor(
    public layoutService: LayoutService,
    private confirmation: ConfirmationService,
    private router: Router
  ) {}

  onUserAction(event: any) {
    if (event?.value === 'logout') {
      this.confirmation.confirm({
        header: 'Log out?',
        message: 'Haqiqatan ham tizimdan chiqasizmi?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Logout',
        rejectLabel: 'Bekor qilish',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => this.logout(),
        reject: () => {
          this.selectedOption = null;
        }
      });
    }
  }

  logout() {
    try {
      localStorage.clear();
    } finally {
      this.selectedOption = null;
      this.router.navigate(['/auth/login']);
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
