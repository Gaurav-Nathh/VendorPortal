import {
  APP_INITIALIZER,
  ApplicationConfig,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withPreloading,
} from '@angular/router';

import { commonRoutes, customerRoute, vendorRoutes } from './app.routes';
import { ApiConfigService } from './services/api-config/api-config.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// export function initApp(configService: ApiConfigService) {
//   return () => {
//     configService.initialize();
//   };
// }

function initializeAppConfig() {
  const configService = inject(ApiConfigService);
  return configService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      [...commonRoutes, ...customerRoute, ...vendorRoutes],
      withPreloading(PreloadAllModules)
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAppInitializer(initializeAppConfig),
  ],
};
