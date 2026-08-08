import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export type ControlErrorResolver = string | ((details: unknown) => string);
export type ControlErrorMessages = Readonly<Record<string, ControlErrorResolver>>;

@Component({
  selector: 'app-control-error',
  standalone: true,
  template: `
    <div
      class="control-error"
      [class.control-error--visible]="message"
      [attr.aria-hidden]="!message"
    >
      <small>{{ message || ' ' }}</small>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .control-error {
      color: var(--error-text);
      min-height: 1.22rem;
      font-size: 1.2rem;
      line-height: 1.05;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
    }

    .control-error--visible {
      opacity: 1;
      visibility: visible;
    }
  `]
})
export class ControlErrorComponent {
  @Input() control: AbstractControl | null | undefined;
  @Input() messages: ControlErrorMessages = {};

  get message(): string {
    const control = this.control;
    if (!control?.invalid || (!control.dirty && !control.touched)) return '';

    const errors = control.errors;
    if (!errors) return '';

    for (const [key, resolver] of Object.entries(this.messages)) {
      if (!errors[key]) continue;
      return typeof resolver === 'function' ? resolver(errors[key]) : resolver;
    }

    return '';
  }
}
