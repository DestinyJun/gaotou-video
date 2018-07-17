import {
  AfterContentInit,
  AfterViewInit,
  Component, ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NavComponent} from './nav/nav.component';
import {EventsService} from '../common/services/events.service';
import {LoginService} from '../common/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
  // 时间
  public dataTime = new Date();
  public navShow = false;
  // 客流量
  public person: any;
  // 动态创建组件
  @ViewChild('navFlag', {read: ViewContainerRef})
  navFlag: ViewContainerRef;
  compNav1: ComponentRef<NavComponent>;

  constructor(
    private eventsService: EventsService,
    private resolver: ComponentFactoryResolver,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit() {
    this.amount();
    setInterval(() => {
      this.dataTime = new Date();
    });
  }

  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {

  }

  // 控制侧边导航栏显示隐藏
  public navShowClick(): void {
    this.navShow = !this.navShow;
    if (this.navShow) {
      const childNavComp1 = this.resolver.resolveComponentFactory(NavComponent);
      this.compNav1 = this.navFlag.createComponent(childNavComp1);
    } else {
      this.destoryChild();
    }
    this.eventsService.eventBus.next('点击导航条');
  }

  // 销毁已创建的组建
  public destoryChild(): void {
    this.compNav1.destroy();
  }

  // 客流量实时监控
  public amount(): void {
    let a = 1;
    setInterval(() => {
      a += Math.round(Math.random() * 10);
      a.toString().split('').map((value, index) => {

     });
    }, 3000);
  }

  // 时钟
 /* public getTime(): any {
    let week: string;
    let dateTim: any;
    // 日期
    const date = new Date();
    // 年
    const year = date.getFullYear();
    // 月
    const month = date.getMonth() + 1;
    let months: string;
    if (month >= 1 && month <= 9) {
      months = '0' + month;
    } else {
      months = month.toString();
    }
    // 日
    const day = date.getDate();
    let days: string;
    if (day >= 1 && day <= 9) {
      days = '0' + month;
    } else {
      days = day.toString();
    }
    // 周
    const star = date.getDay();
    switch (star) {
      case 0:
        week = '周日';
        break;
      case 1:
        week = '周一';
        break;
      case 2:
        week = '周二';
        break;
      case 3:
        week = '周三';
        break;
      case 4:
        week = '周四';
        break;
      case 5:
        week = '周五';
        break;
      case 6:
        week = '周六';
        break;
    }
    // 时
    const hour = date.getHours();
    let hours: string;
    if (hour >= 1 && hour <= 9) {
      hours = '0' + hour;
    } else {
      hours = hour.toString();
    }
    // 分
    const minute = date.getMinutes();
    let minutes: string;
    if (minute >= 1 && minute <= 9) {
      minutes = '0' + minute;
    } else {
      minutes = minute.toString();
    }
    // 秒
    const second = date.getSeconds();
    let seconds: string;
    if (second >= 1 && second <= 9) {
      seconds = '0' + second;
    } else {
      seconds = second.toString();
    }
    // 组合
    const times = hours + ':' + minutes + ':' + seconds;
    const b = `
            <span style="margin-right: 10px">北京时间</span>
            <span>${year}年</span>
            <span>${months}月</span>
            <span style="margin-right: 10px">${days}日</span>
            <span style="margin-right: 10px">${week}</span>
            <span>${times}</span>`;
    dateTim = year + '-' + months + '-' + days;
  }*/
}
