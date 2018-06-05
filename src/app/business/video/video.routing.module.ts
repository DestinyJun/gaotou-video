import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
const routes: Routes = [
  {path: '', redirectTo: 'videom', pathMatch: 'full'},
  {path: 'videow', loadChildren: 'app/business/video/video-window/video-window.module#VideoWindowModule'},
  {path: 'videom', loadChildren: 'app/business/video/video-manage/video-manage.module#VideoManageModule'}
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VideoRoutingModule {}
