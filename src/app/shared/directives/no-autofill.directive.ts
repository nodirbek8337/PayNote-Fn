import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

/** Keep browser autofill out of application state; API values and manual input still work. */
@Directive({
  selector: 'input[appNoAutofill], textarea[appNoAutofill]',
  standalone: true,
  host: {
    'data-paynote-no-autofill': 'true',
    'data-lpignore': 'true',
    'data-1p-ignore': 'true',
    'data-bwignore': 'true'
  }
})
export class NoAutofillDirective implements OnInit, OnDestroy {
  @Input() appNoAutofill: unknown = '';

  constructor(private element: ElementRef<HTMLInputElement | HTMLTextAreaElement>) {}

  private readonly rejectAutofill = (event: Event) => {
    const input = this.element.nativeElement;
    if (event.type === 'animationstart' && (event as AnimationEvent).animationName !== 'paynote-autofill') return;
    // Capture before Angular's value accessor sees the injected value.
    if (!this.isAutofilled(input)) return;
    input.value = String(this.appNoAutofill ?? '');
    event.stopImmediatePropagation();
  };

  ngOnInit(): void {
    const input = this.element.nativeElement;
    if (!input.hasAttribute('autocomplete')) {
      input.setAttribute('autocomplete', input.type === 'password' ? 'new-password' : 'off');
    }
    for (const event of ['input', 'change', 'animationstart']) {
      input.addEventListener(event, this.rejectAutofill, true);
    }
  }

  ngOnDestroy(): void {
    for (const event of ['input', 'change', 'animationstart']) {
      this.element.nativeElement.removeEventListener(event, this.rejectAutofill, true);
    }
  }

  private isAutofilled(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    for (const selector of [':autofill', ':-webkit-autofill']) {
      try {
        if (input.matches(selector)) return true;
      } catch {
        // Older browsers may not support one of these selectors.
      }
    }
    return false;
  }
}
