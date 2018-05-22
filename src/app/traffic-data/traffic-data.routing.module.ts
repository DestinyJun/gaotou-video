import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TrafficDataComponent} from './traffic-data.component';
const routes: Routes = [
  {path: '', component: TrafficDataComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TrafficDataRoutingModule {}
