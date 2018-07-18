import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';
import { ServiceDataComponent } from './service-data.component';
import {ServiceDataRoutingModule} from './service-data.routing.module';

@NgModule({
  imports: [
    CommonModule,
    ServiceDataRoutingModule,
    SharedModule
  ],
  declarations: [ServiceDataComponent]
})
export class ServiceDataModule { }
