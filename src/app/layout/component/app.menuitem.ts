import { Component, HostBinding, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { MenuItem } from 'primeng/api';

@Component({
    selector: '[app-menuitem]',
    standalone: true,
    imports: [CommonModule, RouterModule, RippleModule],
    template: `
        <ng-container>
            @if (root && item.visible !== false) {
                <div class="layout-menuitem-root-text">
                    {{ item.label }}
                </div>
            }

            @if ((!item.routerLink || item.items) && item.visible !== false) {
                <a [attr.href]="item.url" (click)="itemClick($event)" [ngClass]="item.styleClass" [attr.target]="item.target" tabindex="0" pRipple>
                    <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                    <span class="layout-menuitem-text">{{ item.label }}</span>
                    @if (item.items) {
                        <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                    }
                </a>
            }

            @if (item.routerLink && !item.items && item.visible !== false) {
                <a
                    (click)="itemClick($event)"
                    [ngClass]="item.styleClass"
                    [routerLink]="item.routerLink"
                    routerLinkActive="active-route"
                    [routerLinkActiveOptions]="item.routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
                    [fragment]="item.fragment"
                    [queryParamsHandling]="item.queryParamsHandling"
                    [preserveFragment]="item.preserveFragment"
                    [skipLocationChange]="item.skipLocationChange"
                    [replaceUrl]="item.replaceUrl"
                    [state]="item.state"
                    [queryParams]="item.queryParams"
                    [attr.target]="item.target"
                    tabindex="0"
                    pRipple
                >
                    <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
                    <span class="layout-menuitem-text">{{ item.label }}</span>
                </a>
            }

            @if (item.items && item.visible !== false) {
                <ul [@children]="submenuAnimation">
                    @for (child of item.items; track child; let i = $index) {
                        <li app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child['badgeClass']"></li>
                    }
                </ul>
            }
        </ng-container>
    `,
    animations: [trigger('children', [state('collapsed', style({ height: '0' })), state('expanded', style({ height: '*' })), transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))])]
})
export class AppMenuitem implements OnInit, OnDestroy {
    @Input() item!: MenuItem;
    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root = false;
    @Input() parentKey!: string;

    active = false;
    key = '';
    readonly router = inject(Router);
    private routeSub?: Subscription;

    ngOnInit() {
        this.key = this.parentKey ? `${this.parentKey}-${this.index}` : String(this.index);
        this.syncActiveFromRoute();
        this.routeSub = this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.syncActiveFromRoute());
    }

    private syncActiveFromRoute() {
        if (!this.item?.routerLink) return;
        const link = Array.isArray(this.item.routerLink) ? this.item.routerLink[0] : this.item.routerLink;
        try {
            const isActive = this.router.isActive(link, {
                paths: 'exact',
                queryParams: 'ignored',
                matrixParams: 'ignored',
                fragment: 'ignored'
            });
            if (isActive) this.active = true;
        } catch {
            // An incomplete menu route cannot be resolved yet.
        }
    }

    itemClick(event: Event) {
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }
        if (this.item.items?.length) {
            event.preventDefault();
            this.active = !this.active;
        }
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : this.active ? 'expanded' : 'collapsed';
    }

    @HostBinding('class.active-menuitem')
    get activeClass() {
        return this.active && !this.root;
    }

    ngOnDestroy() {
        this.routeSub?.unsubscribe();
    }
}
