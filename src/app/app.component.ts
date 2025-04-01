import { Component } from '@angular/core';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'suni_intelekt_loborotoriyasi';

  isLoading: boolean = false;

  constructor(private loadingService: LoadingService) {
    this.loadingService.loaderState$.subscribe(state => {
      this.isLoading = state;
    });
  }
}
