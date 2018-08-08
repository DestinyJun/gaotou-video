import {Component, OnInit, TemplateRef} from '@angular/core';
import {environment} from '../environments/environment';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ConfigModule} from './common/wenjun';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  public modalRef: BsModalRef;
  public config: ConfigModule;
  public show = false;
  constructor(
    private modalService: BsModalService
  ) {
    console.log('当前产品状态是：' + environment.weixin);
  }

  ngOnInit(): void {
    this.config = {
      alertTitle: '王小二',
      titleColor: 'red',
      titleBgColor: 'orange',
      background: 'blue',
      width: 80,
      height: 60,
    };
  }
  public btnClick() {
    this.show = true;
  }
}
