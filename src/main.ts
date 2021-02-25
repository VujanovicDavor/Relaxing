import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log("hellogyus welcome to my minecraft lets playy today we going to mining for some diamonds o there os a  co")
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
