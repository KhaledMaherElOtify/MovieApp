import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

<<<<<<< HEAD

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
=======
bootstrapApplication(App, {
  providers: [provideHttpClient(), provideRouter(routes)],
});
>>>>>>> 8cc1136a925c2f59c480a469f49bd3238cfa7c0a
