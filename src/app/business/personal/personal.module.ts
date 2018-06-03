import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import {PersonalRoutingModule} from './personal.routing.module';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
