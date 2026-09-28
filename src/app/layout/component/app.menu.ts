import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item; let i = $index) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [index]="i" [root]="true"></li>
            }
            @if (item.separator) {
                <li class="menu-separator"></li>
            }
        }
    </ul>`
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Omborxona',
                items: [
                    { label: 'Ombor', icon: 'pi pi-warehouse', routerLink: ['/inventory'] },
                    { label: 'Maxsulotlar', icon: 'pi pi-box', routerLink: ['/products'] },
                    { label: 'Tarix', icon: 'pi pi-history', routerLink: ['/sales-history'] },
                    { label: 'Sotuv', icon: 'pi pi-shopping-cart', routerLink: ['/sales'] }
                ]
            },
            {
                label: 'Sozlamalar',
                items: [{ label: 'Foydalanuvchilar', icon: 'pi pi-users', routerLink: ['/users'] }]
            }
        ];
    }
}
