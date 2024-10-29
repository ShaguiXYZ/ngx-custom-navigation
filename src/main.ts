import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

// @howto add header scripts by enviroment
if (environment.scripts) {
  environment.scripts.forEach(src => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  });
}

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
