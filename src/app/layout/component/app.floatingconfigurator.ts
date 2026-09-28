import { Component, computed, inject } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-floating-configurator',
    imports: [ButtonDirective, StyleClassModule, AppConfigurator],
    template: `
        <div class="fixed flex gap-4 top-8 right-8">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-secondary"
                (click)="toggleDarkMode()"
                [attr.aria-label]="isDarkTheme() ? 'Yorug‘ mavzuga o‘tish' : 'Qorong‘i mavzuga o‘tish'"
            >
                <i [class]="isDarkTheme() ? 'pi pi-moon' : 'pi pi-sun'" aria-hidden="true"></i>
            </button>
            <div class="relative">
                <button
                    pButton
                    type="button"
                    class="p-button-rounded"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true"
                    aria-label="Sozlamalarni ochish"
                >
                    <i class="pi pi-palette" aria-hidden="true"></i>
                </button>
                <app-configurator />
            </div>
        </div>
    `
})
export class AppFloatingConfigurator {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.LayoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
