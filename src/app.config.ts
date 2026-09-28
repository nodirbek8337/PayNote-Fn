import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './app/shared/interceptor/auth.interceptor';

import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(
      withInterceptors([AuthInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      license: 'eyJpZCI6Ijg5ZjdlZTIzLTQzMDItNDkyYi05ZjE2LTI2MDlmMjRmYTNkYyIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTA2MTM5ODIsImV4cCI6MTgyMjE0OTk4Mn0.lXFZ4rTLrSJBTMltPsN24s3jJYVkezNBNmXJXp89AxXzKvg8TVyWzbapzskkn1l95uStIWQ-dblNFxL1syO7Cw',
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } }
    }),

    importProvidersFrom(ToastModule),
    MessageService,
  ],
};
