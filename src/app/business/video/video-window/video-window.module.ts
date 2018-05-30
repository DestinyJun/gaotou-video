import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {VideoWindowRoutingModule} from './video-window.routing.module';
import {VideoWindowComponent} from './video-window.component';
import { TreeModule } from 'ng2-tree';
@NgModule({
  imports: [
    CommonModule,
    VideoWindowRoutingModule,
    TreeModule
  ],
  declarations: [VideoWindowComponent]
})
export class VideoWindowModule { }
