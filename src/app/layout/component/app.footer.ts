import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [CommonModule],
    template: `
        <footer class="layout-footer">
            <div class="footer-center">
                © 2025 — ishlab chiqilgan
                <span class="muted"> · v1.0.0</span>
            </div>
        </footer>
    `
})
export class AppFooter {}
