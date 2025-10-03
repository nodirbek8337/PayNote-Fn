import { Pipe, PipeTransform } from '@angular/core';
import { digits12, formatUzPhonePretty } from '../utils/phone.util';

@Pipe({ name: 'phoneNumber', standalone: true })
export class PhoneNumberPipe implements PipeTransform {
  transform(value: unknown): string {
    const v = digits12(value);
    if (!v) return '-';
    return formatUzPhonePretty(v);
  }
}
