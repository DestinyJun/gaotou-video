import { Component, OnInit } from '@angular/core';
import {ToolsService} from '../../common/services/tools.service';
import {ActivatedRoute} from '@angular/router';
import {LocalStorageService} from '../../common/services/local-storage.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // 时间
  public dataTime = new Date();
  // 顶部标题
  public headerTitle: string;
  // 客流量
  public personNum = 60000;
  public persons = [];
  constructor(
    private tools: ToolsService,
    private routerInfo: ActivatedRoute,
    private localService: LocalStorageService,
  ) { }

  ngOnInit() {
    // this.amount();
    this.personNum.toString().split('').map((value, index) => {
      this.persons.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
    });
    setInterval(() => {
      this.dataTime = new Date();
    });
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        // this.headerTitle = params.name;
        // console.log(this.headerTitle);
        // this.serviceZonePoint = params.point.split(',');
        // console.log(this.serviceZonePoint);
      }
    );
    // this.getUrl();

    // 订阅title以及车流事件
    this.localService.eventBus.subscribe((value) => {
      this.headerTitle = value;
    });
    this.localService.persons.subscribe((value) => {
      console.log(value);
      this.persons = value;
    });
  }
  // 客流量实时监控
  public amount(): void {
    setInterval(() => {
      const b = [];
      this.personNum += Math.round(Math.random() * 10);
      this.personNum.toString().split('').map((value, index) => {
        b.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
        this.persons = b;
      });
    }, 3000);
  }
  // 获取URL，风格URL
  public getUrl(): void {
    const url = window.location.href;
    const urlString = url.split('#')[1].split('/')[2];
    if (urlString === 'finance') {
      this.headerTitle = '贵州省高速业态大数据';
    } else if (urlString === 'city') {
      this.headerTitle = '贵阳市高速大数据';
    } else if (urlString === 'whole') {
      this.headerTitle = '全国高速业态大数据';
    }
  }
}
