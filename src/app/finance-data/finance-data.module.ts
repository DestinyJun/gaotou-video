import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDataComponent } from './finance-data.component';
import {FinanceDataRoutingModule} from './finance-data.routing.module';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule,
    NgxEchartsModule
  ],
  declarations: [FinanceDataComponent]
})
export class FinanceDataModule { }
