import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loaderStateSubject = new BehaviorSubject<boolean>(false);
  loaderState$ = this.loaderStateSubject.asObservable();

  setLoadingState(state: boolean) {
    this.loaderStateSubject.next(state);
  }
}
