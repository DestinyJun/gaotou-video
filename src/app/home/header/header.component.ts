import { Component, OnInit } from '@angular/core';
import {ToolsService} from '../../common/services/tools.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // 时间
  public dataTime = new Date();
  // 顶部标题
  public headerTitle = '';
  // 客流量
  public personNum = 60000;
  public persons = [];
  constructor(
    private tools: ToolsService,
    private routerInfo: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.amount();
    console.log(this.routerInfo);
    this.personNum.toString().split('').map((value, index) => {
      this.persons.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
    });
    setInterval(() => {
      this.dataTime = new Date();
    });
    // 路由接受参数
    this.routerInfo.params.subscribe(
      (params) => {
        console.log(params);
        // this.headerTitle = params.name;
        // console.log(this.headerTitle);
        // this.serviceZonePoint = params.point.split(',');
        // console.log(this.serviceZonePoint);
      }
    );
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
}
