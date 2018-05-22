import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficDataComponent } from './traffic-data.component';
import {TrafficDataRoutingModule} from './traffic-data.routing.module';

@NgModule({
  imports: [
    CommonModule,
    TrafficDataRoutingModule
  ],
  declarations: [TrafficDataComponent]
})
export class TrafficDataModule { }
