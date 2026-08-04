import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AnalyticsService } from './core/services/analytics.service';
import { SeoService } from './core/services/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'disabled', scrollPositionRestoration: 'disabled' })
    ),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      inject(AnalyticsService).init();
    }),
    provideAppInitializer(() => {
      inject(SeoService).init();
    }),
  ],
};
