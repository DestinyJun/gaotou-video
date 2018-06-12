import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: 'finance', pathMatch: 'full'},
      {path: 'finance', loadChildren: 'app/business/finance-data/finance-data.module#FinanceDataModule'},
      {path: 'videom', loadChildren: 'app/business/video-manage/video-manage.module#VideoManageModule'},
      {path: 'videow', loadChildren: 'app/business/video-window/video-window.module#VideoWindowModule'},
      {path: 'personal', loadChildren: 'app/business/personal/personal.module#PersonalModule'},
    ]
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
