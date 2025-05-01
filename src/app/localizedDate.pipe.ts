import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { TranslateModule } from '@ngx-translate/core';


@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  translateService = inject(TranslateService);
  private datePipe = new DatePipe('en-US');
  private currentLang$ = new BehaviorSubject<string>(this.translateService.currentLang ||'uz');

  constructor () {
    this.translateService.onLangChange.subscribe(event => {
      this.currentLang$.next(event.lang)
    });
  }
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }
}
