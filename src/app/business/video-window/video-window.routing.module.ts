import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VideoWindowComponent} from './video-window.component';
const routes: Routes = [
  {path: '', component: VideoWindowComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VideoWindowRoutingModule {}
