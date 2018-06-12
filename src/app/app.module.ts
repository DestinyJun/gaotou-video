import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app.routing.module';
import {LoginService} from './shared/login.service';
import {LocalStorageService} from './shared/local-storage.service';
import {AppComponent} from './app.component';
import {LoginGuard} from './guard/login.guard';
import {EventsService} from './shared/events.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    LoginService,
    LocalStorageService,
    LoginGuard,
    EventsService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
