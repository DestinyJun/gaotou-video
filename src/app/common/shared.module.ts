import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgxEchartsModule} from 'ngx-echarts';
import {ReactiveFormsModule} from '@angular/forms';
import {TreeModule} from 'ng2-tree';
import {EventsService} from './services/events.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    TreeModule
  ],
  exports: [
    HttpClientModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [EventsService]
})
export class SharedModule { }
