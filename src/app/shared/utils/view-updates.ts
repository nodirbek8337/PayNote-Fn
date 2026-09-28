import { ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MonoTypeOperatorFunction, defer, finalize, tap } from 'rxjs';

/** Create in a component's injection context; use on asynchronous subscriptions. */
export function injectViewUpdates() {
    const view = inject(ChangeDetectorRef);
    const destroyRef = inject(DestroyRef);
    const notify = () => { if (!destroyRef.destroyed) view.markForCheck(); };

    return <T>(): MonoTypeOperatorFunction<T> => (source) => defer(() => {
        notify();
        return source.pipe(
            takeUntilDestroyed(destroyRef),
            tap({ next: notify, error: notify }),
            finalize(notify)
        );
    });
}
