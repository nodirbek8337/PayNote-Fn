import { Component } from '@angular/core';
import { LoadingService } from './core/services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'suni_intelekt_loborotoriyasi';

  isLoading: boolean = false;

  constructor(
    private loadingService: LoadingService, 
    private translate: TranslateService
    
  ) {
    this.loadingService.loaderState$.subscribe(state => {
      setTimeout(() => {
        this.isLoading = state;
      });
    });
    translate.setDefaultLang('en');
    translate.use('en');
  }
}
