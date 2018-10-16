import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalComponent } from './personal.component';
import {PersonalRoutingModule} from './personal.routing.module';
import {SharedModule} from '../../common/shared.module';
import {CalendarModule} from 'primeng/calendar';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
