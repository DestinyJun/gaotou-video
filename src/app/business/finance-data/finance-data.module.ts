import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDataComponent } from './finance-data.component';
import {FinanceDataRoutingModule} from './finance-data.routing.module';
import {NgxEchartsModule} from 'ngx-echarts';
import { ChildDataMapComponent } from './child-data-map/child-data-map.component';
import {BsDropdownModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule,
    NgxEchartsModule,
    BsDropdownModule.forRoot()
  ],
  declarations: [FinanceDataComponent, ChildDataMapComponent],
  entryComponents: [ChildDataMapComponent]
})
export class FinanceDataModule { }
