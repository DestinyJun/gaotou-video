import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VideoManageComponent} from './video-manage.component';
const routes: Routes = [
  {path: '', component: VideoManageComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VideoManageRoutingModule {}
