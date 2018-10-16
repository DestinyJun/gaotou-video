import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../common/services/local-storage.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  public value: Date; // 时间选择器
  public  es: any; // 时间名称初始化
  // 实时客流量
  public personNum = 2000;
  public persons = [];
  // btn状态值判断
  public btnProfileTxt = true;
  public btnPasswordTxt = true;
  public userInfo = {
    name: '王小花',
    duty: '项目经理',
    phone: '18888888888',
    email: '8888888888@qq.com',
    address: '贵州省贵阳市云岩区黔灵山路',
    remark: '这个孩子非常努力',
  };
  constructor(
    private localService: LocalStorageService
  ) { }

  ngOnInit() {
    // 发射实时客流
    this.localService.persons.next(this.persons);
    // 时间初始化
    this.es = {
      firstDayOfWeek: 0,
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesMin: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      today: 'Today',
      clear: 'Clear'
    };
  }
  public updataProfile() {
    this.btnProfileTxt = !this.btnProfileTxt;
  }
  public updataPaaword() {
    this.btnPasswordTxt = !this.btnPasswordTxt;
  }
}
