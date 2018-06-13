import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDataComponent } from './finance-data.component';
import {FinanceDataRoutingModule} from './finance-data.routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import { ChildDataMapComponent } from './child-data-map/child-data-map.component';

@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule,
    NgxEchartsModule
  ],
  declarations: [FinanceDataComponent, ChildDataMapComponent],
  entryComponents: [ChildDataMapComponent]
})
export class FinanceDataModule { }
