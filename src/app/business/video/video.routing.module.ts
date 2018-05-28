import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
const routes: Routes = [
  {path: '', redirectTo: 'videow', pathMatch: 'full'},
  {path: 'videow', loadChildren: 'app/business/video/video-window/video-window.module#VideoWindowModule'}
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class VideoRoutingModule {}
