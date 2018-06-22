import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoManageComponent } from './video-manage.component';
import {VideoManageRoutingModule} from './video-manage.routing.module';
import {SharedModule} from '../../common/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VideoManageRoutingModule,
    SharedModule
  ],
  declarations: [VideoManageComponent]
})
export class VideoManageModule { }
