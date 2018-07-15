import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WholeDataComponent} from './whole-data.component';
const routes: Routes = [
  {path: '', component: WholeDataComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class WholeDataRoutingModule {}
