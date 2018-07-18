import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDataComponent } from './service-data.component';
import {ServiceDataRoutingModule} from './service-data.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ServiceDataRoutingModule
  ],
  declarations: [ServiceDataComponent]
})
export class ServiceDataModule { }
