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

@NgModule({
  declarations: [],
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
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [
    EventsService,
    Data3dService,
    CentermapService,
    DiagramService,
    ToolsService
  ]
})
export class SharedModule { }
