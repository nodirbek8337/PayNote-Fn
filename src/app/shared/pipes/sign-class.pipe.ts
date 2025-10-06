import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'signClass',
  standalone: true,
  pure: true,
})
export class SignClassPipe implements PipeTransform {
  transform(value: unknown): string {
    const n = Number(value);
    if (!Number.isFinite(n) || n === 0) return 'text-gray-500';
    return n < 0 ? 'text-red-500' : 'text-green-600';
  }
}
