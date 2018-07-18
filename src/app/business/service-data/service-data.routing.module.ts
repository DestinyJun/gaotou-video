import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ServiceDataComponent} from './service-data.component';
const routes: Routes = [
  {path: '', component: ServiceDataComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ServiceDataRoutingModule {}
