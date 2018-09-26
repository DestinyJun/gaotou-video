import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';
import {FinanceDataRoutingModule} from './finance-data.routing.module';

import { FinanceDataComponent } from './finance-data.component';
import {FormsModule} from '@angular/forms';
import {WenjunAlertModule} from '../../common/wenjun';
import { FinanceDataService } from '../../common/services/finance-data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FinanceDataRoutingModule,
    SharedModule,
    WenjunAlertModule
  ],
  declarations: [FinanceDataComponent],
  entryComponents: [],
  providers: [FinanceDataService]
})
export class FinanceDataModule { }
