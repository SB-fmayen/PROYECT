import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // <- también desde aquí
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig, // ✅ usa el objeto directamente
  providers: [
    ...appConfig.providers,
    provideHttpClient()
  ]
});
