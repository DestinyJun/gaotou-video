import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeRoutingModule} from './home.routing.module';
import {SharedModule} from '../common/shared.module';

import { HomeComponent } from './home.component';
import { HeaderComponent } from './header/header.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ],
  declarations: [HomeComponent, HeaderComponent, NavComponent, FooterComponent],
  entryComponents: [NavComponent]
})
export class HomeModule { }
