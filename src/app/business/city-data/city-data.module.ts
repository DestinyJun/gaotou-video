import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../../common/shared.module';

import { CityDataComponent } from './city-data.component';
import {CityDataRoutingModule} from './city-data.routing.module';
import {WenjunAlertModule} from '../../common/wenjun';

@NgModule({
  imports: [
    CommonModule,
    CityDataRoutingModule,
    SharedModule,
    WenjunAlertModule
  ],
  declarations: [CityDataComponent]
})
export class CityDataModule { }
