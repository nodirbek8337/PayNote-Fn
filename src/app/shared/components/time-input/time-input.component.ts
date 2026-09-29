import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-time-input',
    standalone: true,
    templateUrl: './time-input.component.html',
    styleUrls: ['./time-input.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TimeInputComponent), multi: true }]
})
export class TimeInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private readonly host = inject(ElementRef<HTMLElement>);
    @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

    @Input() disabled = false;
    @Input() ariaLabel = 'Vaqtni tanlash';

    readonly hours = Array.from({ length: 24 }, (_, hour) => String(hour).padStart(2, '0'));
    readonly minutes = Array.from({ length: 12 }, (_, minute) => String(minute * 5).padStart(2, '0'));

    value = '';
    open = false;
    isPortaled = false;
    private isDisabled = false;
    private panelPlaceholder?: Comment;
    private originalPanelParent?: Node;
    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: string | null | undefined): void {
        this.value = typeof value === 'string' && /^\d{2}:\d{2}$/.test(value) ? value : '';
    }

    registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }

    ngAfterViewInit(): void {
        this.originalPanelParent = this.panelRef.nativeElement.parentNode ?? undefined;
    }

    ngOnDestroy(): void {
        this.restorePanel();
    }

    toggle(): void {
        if (this.effectiveDisabled) return;
        if (this.open) this.close();
        else {
            this.open = true;
            this.movePanelToOverlay();
            requestAnimationFrame(() => this.positionPanel());
        }
        this.onTouched();
    }

    selectHour(hour: string): void {
        this.value = `${hour}:${this.selectedMinute}`;
        this.onChange(this.value);
        this.onTouched();
    }

    get selectedHour(): string { return (this.value || '00:00').slice(0, 2); }
    get selectedMinute(): string { return (this.value || '00:00').slice(3, 5); }

    selectMinute(minute: string): void {
        this.value = `${this.selectedHour}:${minute}`;
        this.onChange(this.value);
        this.onTouched();
    }

    close(): void {
        this.open = false;
        this.restorePanel();
    }
    get effectiveDisabled(): boolean { return this.disabled || this.isDisabled; }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as Node;
        if (!this.host.nativeElement.contains(target) && !this.panelRef?.nativeElement.contains(target)) this.close();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void { this.close(); }

    @HostListener('window:resize')
    @HostListener('window:scroll')
    onViewportChange(): void {
        if (this.open) this.positionPanel();
    }

    private movePanelToOverlay(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || this.isPortaled) return;

        this.originalPanelParent ??= panel.parentNode ?? undefined;
        if (!this.originalPanelParent) return;

        this.panelPlaceholder = document.createComment('time-input-panel');
        this.originalPanelParent.insertBefore(this.panelPlaceholder, panel);
        document.body.appendChild(panel);
        this.isPortaled = true;
    }

    private restorePanel(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || !this.isPortaled || !this.originalPanelParent) return;

        this.originalPanelParent.insertBefore(panel, this.panelPlaceholder ?? null);
        this.panelPlaceholder?.remove();
        this.panelPlaceholder = undefined;
        this.isPortaled = false;
        panel.style.removeProperty('top');
        panel.style.removeProperty('left');
        panel.style.removeProperty('max-height');
    }

    private positionPanel(): void {
        const panel = this.panelRef?.nativeElement;
        const trigger = this.host.nativeElement.querySelector('.time-input__trigger') as HTMLElement | null;
        if (!panel || !trigger || !this.isPortaled) return;

        const triggerRect = trigger.getBoundingClientRect();
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const gap = 8;
        const availableBelow = window.innerHeight - triggerRect.bottom - gap;
        const openBelow = availableBelow >= Math.min(panelHeight, 260) || triggerRect.top < panelHeight + gap;
        const top = openBelow ? triggerRect.bottom + gap : Math.max(gap, triggerRect.top - panelHeight - gap);
        const left = Math.max(gap, Math.min(triggerRect.right - panelWidth, window.innerWidth - panelWidth - gap));

        panel.style.top = `${top}px`;
        panel.style.left = `${left}px`;
        panel.style.maxHeight = `${Math.max(180, openBelow ? availableBelow : triggerRect.top - gap)}px`;
    }
}
