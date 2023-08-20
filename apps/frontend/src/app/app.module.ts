import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, TitleStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'ngx-moment';
import { NgPipesModule } from 'ngx-pipes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedComponentsModule } from './components/shared-components.module';
import { AuthInterceptor } from './interceptor/auth-interceptor';
import { CustomTitleStrategy } from './services/custom-title-strategy/custom-title-strategy.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__PHD109DB',
      driverOrder: [
        CordovaSQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
      ],
    }),
    IonicModule.forRoot({
      mode: 'ios',
    }),
    NgPipesModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    MomentModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
