/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { XMLHttpRequestHttpClient } from './app/services/xml-http-client';

async function main() {
  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [...(appConfig.providers || []), provideHttpClient()],
  }).catch((err) => console.error(err));
}

main();
