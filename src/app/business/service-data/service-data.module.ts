import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';
import { ServiceDataComponent } from './service-data.component';
import {ServiceDataRoutingModule} from './service-data.routing.module';
import { ServiceDataService } from '../../common/services/service-data.service';
import { FinanceDataService } from '../../common/services/finance-data.service';
import {CalendarModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    ServiceDataRoutingModule,
    SharedModule,
    CalendarModule
  ],
  declarations: [ServiceDataComponent],
  providers: [ServiceDataService, FinanceDataService]
})
export class ServiceDataModule { }
