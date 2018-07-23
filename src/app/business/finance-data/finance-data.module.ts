import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';
import {FinanceDataRoutingModule} from './finance-data.routing.module';

import { FinanceDataComponent } from './finance-data.component';
import {ScrollPanelModule} from 'primeng/primeng';


@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule,
    SharedModule,
    ScrollPanelModule
  ],
  declarations: [FinanceDataComponent],
  entryComponents: []
})
export class FinanceDataModule { }
