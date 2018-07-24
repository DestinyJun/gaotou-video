import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
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
  constructor() { }

  ngOnInit() {
  }
  public updataProfile() {
    this.btnProfileTxt = !this.btnProfileTxt;
  }
  public updataPaaword() {
    this.btnPasswordTxt = !this.btnPasswordTxt;
  }
}
