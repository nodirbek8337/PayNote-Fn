import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localeUz from '@angular/common/locales/uz';

registerLocaleData(localeUz, 'uz');

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    { provide: LOCALE_ID, useValue: 'uz' },
  ],
}).catch((err) => console.error(err));
