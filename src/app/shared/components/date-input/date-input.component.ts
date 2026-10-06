import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, ViewChild, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-date-input',
    standalone: true,
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.scss'],
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateInputComponent), multi: true }]
})
export class DateInputComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
    private readonly host = inject(ElementRef<HTMLElement>);
    @ViewChild('panel') panelRef!: ElementRef<HTMLElement>;

    @Input() disabled = false;
    @Input() ariaLabel = 'Sanani tanlash';
    @Input() placeholder = 'Sanani tanlang';

    readonly months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    readonly weekdays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
    value: Date | null = null;
    viewMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    open = false;
    isPortaled = false;
    private isDisabled = false;
    private panelPlaceholder?: Comment;
    private originalPanelParent?: Node;
    private onChange: (value: Date | null) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(value: Date | string | null | undefined): void {
        const date = value ? new Date(value) : null;
        this.value = date && !Number.isNaN(date.getTime()) ? date : null;
        if (this.value) this.viewMonth = new Date(this.value.getFullYear(), this.value.getMonth(), 1);
    }

    registerOnChange(fn: (value: Date | null) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }
    setDisabledState(disabled: boolean): void { this.isDisabled = disabled; }
    get effectiveDisabled(): boolean { return this.disabled || this.isDisabled; }

    get displayValue(): string {
        if (!this.value) return this.placeholder;
        const pad = (part: number) => String(part).padStart(2, '0');
        return `${pad(this.value.getDate())}.${pad(this.value.getMonth() + 1)}.${this.value.getFullYear()}`;
    }

    get days(): Date[] {
        const first = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth(), 1);
        const offset = (first.getDay() + 6) % 7;
        const count = Math.ceil((offset + new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7) * 7;
        return Array.from({ length: count }, (_, index) => new Date(first.getFullYear(), first.getMonth(), index - offset + 1));
    }

    isSelected(day: Date): boolean { return this.sameDay(day, this.value); }
    isToday(day: Date): boolean { return this.sameDay(day, new Date()); }

    ngAfterViewInit(): void { this.originalPanelParent = this.panelRef.nativeElement.parentNode ?? undefined; }
    ngOnDestroy(): void { this.restorePanel(); }

    toggle(): void {
        if (this.effectiveDisabled) return;
        if (this.open) this.close();
        else {
            const current = this.value ?? new Date();
            this.viewMonth = new Date(current.getFullYear(), current.getMonth(), 1);
            this.open = true;
            this.movePanelToOverlay();
            requestAnimationFrame(() => this.positionPanel());
        }
        this.onTouched();
    }

    changeMonth(offset: number): void {
        this.viewMonth = new Date(this.viewMonth.getFullYear(), this.viewMonth.getMonth() + offset, 1);
        requestAnimationFrame(() => this.positionPanel());
    }

    select(day: Date): void {
        this.value = new Date(day.getFullYear(), day.getMonth(), day.getDate());
        this.onChange(this.value);
        this.onTouched();
        this.close();
    }

    selectToday(): void { this.select(new Date()); }
    close(): void { this.open = false; this.restorePanel(); }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as Node;
        if (!this.host.nativeElement.contains(target) && !this.panelRef?.nativeElement.contains(target)) this.close();
    }

    @HostListener('document:keydown.escape')
    onEscape(): void { this.close(); }

    @HostListener('window:resize')
    @HostListener('window:scroll')
    onViewportChange(): void { if (this.open) this.positionPanel(); }

    private sameDay(a: Date, b: Date | null): boolean {
        return !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    private movePanelToOverlay(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || this.isPortaled) return;
        this.originalPanelParent ??= panel.parentNode ?? undefined;
        if (!this.originalPanelParent) return;
        this.panelPlaceholder = document.createComment('date-input-panel');
        this.originalPanelParent.insertBefore(this.panelPlaceholder, panel);
        document.body.appendChild(panel);
        panel.style.display = 'block';
        panel.style.position = 'fixed';
        panel.style.zIndex = '2000';
        this.isPortaled = true;
    }

    private restorePanel(): void {
        const panel = this.panelRef?.nativeElement;
        if (!panel || !this.isPortaled || !this.originalPanelParent) return;
        this.originalPanelParent.insertBefore(panel, this.panelPlaceholder ?? null);
        this.panelPlaceholder?.remove();
        this.panelPlaceholder = undefined;
        this.isPortaled = false;
        for (const property of ['top', 'left', 'right', 'max-height', 'display', 'position', 'z-index']) panel.style.removeProperty(property);
    }

    private positionPanel(): void {
        const panel = this.panelRef?.nativeElement;
        const trigger = this.host.nativeElement.querySelector('.date-input__trigger') as HTMLElement | null;
        if (!panel || !trigger || !this.isPortaled) return;
        const triggerRect = trigger.getBoundingClientRect();
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        const gap = 8;
        const availableBelow = window.innerHeight - triggerRect.bottom - gap;
        const openBelow = availableBelow >= panelHeight || triggerRect.top < panelHeight + gap;
        panel.style.top = `${openBelow ? triggerRect.bottom + gap : Math.max(gap, triggerRect.top - panelHeight - gap)}px`;
        panel.style.left = `${Math.max(gap, Math.min(triggerRect.left, window.innerWidth - panelWidth - gap))}px`;
        panel.style.maxHeight = `${Math.max(180, openBelow ? availableBelow : triggerRect.top - gap)}px`;
    }
}
