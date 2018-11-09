import {Component, OnInit} from '@angular/core';
import {environment} from '../environments/environment';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConfigModule} from './common/wenjun';
import {WenjunAlertService} from './common/wenjun';
import {GlobalService} from './common/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private globalService: GlobalService
  ) {
    console.log('当前产品状态是：' + environment.weixin);
  }
  ngOnInit(): void {
    this.globalService.searchList({page: 1, nums: 1000}).subscribe(
      (val) => {
        console.log(val);
      }
    );
  }
}
