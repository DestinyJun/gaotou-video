import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {WenjunAlertComponent} from './wenjun-alert.component';
import {WenjunAlertService} from './wenjun-alert.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [WenjunAlertComponent],
  providers: [WenjunAlertService],
  exports: [WenjunAlertComponent],
})
export class WenjunAlertModule { }
