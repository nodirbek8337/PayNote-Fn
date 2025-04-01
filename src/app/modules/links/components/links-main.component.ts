import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

@Component({
    template: '<router-outlet />',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule
    ]
})
export class LinksMainComponent {
}
