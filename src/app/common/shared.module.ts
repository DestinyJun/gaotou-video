import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgxEchartsModule} from 'ngx-echarts';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TreeModule} from 'ng2-tree';
import {EventsService} from './services/events.service';
import {Data3dService} from './services/data3d.service';
import {CentermapService} from './services/centermap.service';
import {DiagramService} from './services/diagram.service';
import {ToolsService} from './services/tools.service';
import {DataService} from './services/data.service';
import { TableMenuComponent } from './components/table-menu/table-menu.component';
import { TimerShaftCrosswiseComponent } from './components/timer-shaft-crosswise/timer-shaft-crosswise.component';
import { TimerShaftLengthwaysComponent } from './components/timer-shaft-lengthways/timer-shaft-lengthways.component';
import { WenjunAlertComponent } from './wenjun/wenjun-alert/wenjun-alert.component';

@NgModule({
  declarations: [TableMenuComponent, TimerShaftCrosswiseComponent, TimerShaftLengthwaysComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxEchartsModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule
  ],
  exports: [
    HttpClientModule,
    NgxEchartsModule,
    FormsModule,
    ReactiveFormsModule,
    TreeModule,
    TableMenuComponent,
    TimerShaftCrosswiseComponent,
    TimerShaftLengthwaysComponent
  ],
  providers: [
    EventsService,
    Data3dService,
    CentermapService,
    DiagramService,
    ToolsService,
    DataService
  ]
})
export class SharedModule { }
