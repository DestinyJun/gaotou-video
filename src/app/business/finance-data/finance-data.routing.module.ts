import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {FinanceDataComponent} from './finance-data.component';
const routes: Routes = [
  {path: '', component: FinanceDataComponent},
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class FinanceDataRoutingModule {}
