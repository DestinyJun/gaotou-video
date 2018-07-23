import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CityDataComponent} from './city-data.component';
const routes: Routes = [
  {path: '', component: CityDataComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CityDataRoutingModule {}
