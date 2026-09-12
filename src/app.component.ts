import { AfterViewInit, Component } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        if (typeof document === 'undefined') return;

        let revealed = false;
        const reveal = () => {
            if (revealed) return;
            revealed = true;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.body.classList.add('app-ready');
                    setTimeout(() => document.querySelector('.app-boot-loader')?.remove(), 200);
                });
            });
        };

        document.fonts?.ready.then(reveal, reveal);
        setTimeout(reveal, 1500);
    }
}
