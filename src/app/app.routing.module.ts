import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
const routes: Routes = [
  {path: '', redirectTo: 'video', pathMatch: 'full'},
  {path: 'login', loadChildren: 'app/login/login.module#LoginModule'},
  {path: 'home', loadChildren: 'app/home/home.module#HomeModule'},
  {path: 'finance', loadChildren: 'app/finance-data/finance-data.module#FinanceDataModule'},
  {path: 'traffic', loadChildren: 'app/traffic-data/traffic-data.module#TrafficDataModule'},
  {path: 'video', loadChildren: 'app/business/video/video.module#VideoModule'},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
