import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoWindowRoutingModule} from './video-window.routing.module';
import {VideoWindowComponent} from './video-window.component';
import {SharedModule} from '../../common/shared.module';
@NgModule({
  imports: [
    CommonModule,
    VideoWindowRoutingModule,
    SharedModule
  ],
  declarations: [VideoWindowComponent]
})
export class VideoWindowModule { }
