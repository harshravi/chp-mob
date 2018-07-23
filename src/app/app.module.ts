import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { HttpInterceptor } from './config/HTTP';
import { Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';

import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HomeModule } from './features/home/home.module';

import { PubSubService } from '../../src/app/services';
import { MessagingDataService } from '../../src/app/services';
// importing headers service to pass csrf token accross all the services
import { HeadersService } from './constants/url-constants';
import { GlobalEventEmitterService } from './services/EventEmitter/global-event-emitter.service';

// importing angular 2 moment
import { MomentModule } from 'angular2-moment';

import { AdminModule } from './features/admin/admin.module';
import { TestComponent } from './components/core/test/test.component';

export function httpFactory(backend: XHRBackend, defaultOptions: RequestOptions) {
  return new HttpInterceptor(backend, defaultOptions);
}

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [
    LocalStorageModule.withConfig({
      prefix: 'VETAHEALTH',
      storageType: 'localStorage'
    }),
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    AuthModule,
    HomeModule,
    MomentModule,
    AdminModule
  ],
  providers: [
    HeadersService,
    {
      provide: HttpInterceptor,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions]
    },
    PubSubService,
    MessagingDataService,
    GlobalEventEmitterService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
