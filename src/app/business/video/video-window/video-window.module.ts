import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoWindowRoutingModule} from './video-window.routing.module';
import {VideoWindowComponent} from './video-window.component';

@NgModule({
  imports: [
    CommonModule,
    VideoWindowRoutingModule
  ],
  declarations: [VideoWindowComponent]
})
export class VideoWindowModule { }
