import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';
import {FinanceDataRoutingModule} from './finance-data.routing.module';

import { FinanceDataComponent } from './finance-data.component';
import { ChildDataMapComponent } from './child-data-map/child-data-map.component';
import {ScrollPanelModule} from 'primeng/primeng';
import { ChildDataListComponent } from './child-data-list/child-data-list.component';


@NgModule({
  imports: [
    CommonModule,
    FinanceDataRoutingModule,
    SharedModule,
    ScrollPanelModule
  ],
  declarations: [FinanceDataComponent, ChildDataMapComponent, ChildDataListComponent],
  entryComponents: [ChildDataMapComponent]
})
export class FinanceDataModule { }
