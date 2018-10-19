import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';

import { CityDataComponent } from './city-data.component';
import {CityDataRoutingModule} from './city-data.routing.module';
import {WenjunAlertModule} from '../../common/wenjun';
import { CityDataService } from '../../common/services/city-data.service';
import {CalendarModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    CityDataRoutingModule,
    SharedModule,
    WenjunAlertModule,
    CalendarModule
  ],
  declarations: [CityDataComponent],
  providers: [CityDataService]
})
export class CityDataModule { }
