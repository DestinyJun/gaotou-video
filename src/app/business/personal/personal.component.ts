import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../common/services/local-storage.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
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
  }
  public updataProfile() {
    this.btnProfileTxt = !this.btnProfileTxt;
  }
  public updataPaaword() {
    this.btnPasswordTxt = !this.btnPasswordTxt;
  }
}
