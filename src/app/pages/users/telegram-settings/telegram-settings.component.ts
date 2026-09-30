import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { SelectComponent } from '../../../shared/components/select/select.component';
import { TelegramSettings, UsersService } from '../../service/users.service';

@Component({
    selector: 'app-telegram-settings',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonDirective, Dialog, SelectComponent],
    templateUrl: './telegram-settings.component.html',
    styles: [`
        form { display: grid; gap: 1rem; }
        .field { display: grid; gap: .5rem; }
        label { font-weight: 700; }
        .help { color: var(--text-color-secondary); font-size: .85rem; margin: 0; }
        .error { color: var(--error-text, #f87171); margin: 0; }
        .actions { display: flex; justify-content: flex-end; gap: .5rem; }
    `]
})
export class TelegramSettingsComponent implements OnInit {
    private service = inject(UsersService);
    private fb = inject(FormBuilder);
    visible = false;
    loading = false;
    error = '';
    savedMode: TelegramSettings['mode'] | null = null;
    users: TelegramSettings['users'] = [];
    modes = [
        { label: 'Odatiy yuborish', value: 'live' },
        { label: "Barchasini to'xtatish", value: 'paused' },
        { label: 'Faqat bitta foydalanuvchiga (test)', value: 'test' }
    ];
    form = this.fb.group({ mode: this.fb.nonNullable.control<TelegramSettings['mode']>('live'), testUserId: this.fb.control<string | null>(null) });

    get buttonLabel() {
        return this.savedMode === 'test' ? 'Telegram: test' : this.savedMode === 'paused' ? "Telegram: to'xtatilgan" : 'Telegram sozlamalari';
    }

    ngOnInit() { this.load(); }

    open() {
        this.visible = true;
        this.load();
    }

    private load() {
        this.loading = true;
        this.error = '';
        this.service.getTelegramSettings().subscribe({
            next: ({ data }) => {
                this.savedMode = data.mode;
                this.users = data.users;
                this.form.reset({ mode: data.mode, testUserId: data.testUserId });
                this.loading = false;
            },
            error: (error) => {
                this.error = error.error?.message || "Telegram sozlamalarini yuklab bo'lmadi";
                this.loading = false;
                this.savedMode = null;
            }
        });
    }

    save() {
        if (this.loading || this.savedMode === null) return;
        const value = this.form.getRawValue();
        if (value.mode === 'test' && !this.users.some((user) => user._id === value.testUserId)) {
            this.error = 'Telegramga ulangan foydalanuvchini tanlang';
            return;
        }
        this.loading = true;
        this.error = '';
        this.service.saveTelegramSettings(value).subscribe({
            next: ({ data }) => {
                this.savedMode = data.mode;
                this.loading = false;
                this.visible = false;
            },
            error: (error) => {
                this.error = error.error?.message || "Sozlamalarni saqlab bo'lmadi";
                this.loading = false;
            }
        });
    }
}
