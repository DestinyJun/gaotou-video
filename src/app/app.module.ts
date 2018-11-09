import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app.routing.module';
import {SharedModule} from './common/shared.module';

import {LoginGuard} from './common/guard/login.guard';
import {AppComponent} from './app.component';
import {LocalStorageService} from './common/services/local-storage.service';
import {LoginService} from './common/services/login.service';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GlobalService} from './common/services/global.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    LoginService,
    LocalStorageService,
    LoginGuard,
    GlobalService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
