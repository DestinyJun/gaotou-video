import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoWindowRoutingModule} from './video-window.routing.module';
import {VideoWindowComponent} from './video-window.component';
import {SharedModule} from '../../common/shared.module';
import { VideoWindowService } from '../../common/services/video-window.service';
@NgModule({
  imports: [
    CommonModule,
    VideoWindowRoutingModule,
    SharedModule
  ],
  declarations: [VideoWindowComponent],
  providers: [VideoWindowService]
})
export class VideoWindowModule { }
