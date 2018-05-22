import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceDataComponent } from './finance-data.component';
import {FinanceDataRoutingModule} from './finance-data.routing.module';

@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule
  ],
  declarations: [FinanceDataComponent]
})
export class FinanceDataModule { }
