import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  translateService = inject(TranslateService);
  private datePipe = new DatePipe('en-US');

  constructor() {
    this.translateService.onLangChange.subscribe(event => {
      this.datePipe = new DatePipe(event.lang);
    });
  }
    transform(value: any, ...args: any[]) {
        throw new Error('Method not implemented.');
    }

}
