import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoManageComponent } from './video-manage.component';
import {VideoManageRoutingModule} from './video-manage.routing.module';

@NgModule({
  imports: [
    CommonModule,
    VideoManageRoutingModule
  ],
  declarations: [VideoManageComponent]
})
export class VideoManageModule { }
