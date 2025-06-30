import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ConfigService } from './app/services/config.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { XMLHttpRequestHttpClient } from './app/services/xml-http-client';

async function main() {
  const configService = new ConfigService(new XMLHttpRequestHttpClient());

  await configService.loadConfig();

  bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      provideHttpClient(),
      { provide: ConfigService, useValue: configService },
    ],
  }).catch((err) => console.error(err));
}

main();
