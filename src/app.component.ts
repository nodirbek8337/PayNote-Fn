import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `
    <p-toast key="global" position="top-right" appendTo="body" [baseZIndex]="999999"></p-toast>
    <router-outlet></router-outlet>
    `
})
export class AppComponent {}
