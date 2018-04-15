import { Component, OnInit } from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent implements OnInit {
  // 获取主机地址,分割字符串
  public localhostPath: string;
  public localhostPathUrl: string;
  // 获取当前网址
  public curWwwPath: string;
  // 获取主机地址之后的目录
  public pathName: string;
  // 分割字符串
  public pos: any;
  public inviteCode: string;
  public name: string;
  constructor(
    private routerInfo: ActivatedRoute,
    private location: LocationStrategy
  ) {
    this.curWwwPath = window.document.location.href;
    this.pathName = window.document.location.pathname;
    this.pos = this.curWwwPath.indexOf(this.pathName + '#');
    this.localhostPath = this.curWwwPath.substring(0, this.pos);
    this.inviteCode = this.routerInfo.snapshot.params['invitecode'];
    this.name = this.routerInfo.snapshot.params['name'];
    this.localhostPathUrl = this.localhostPath + '/#' +  '/register' + '/' +  this.inviteCode + '/' + this.name;
  }

  ngOnInit() {
  }
  public goBack(): void {
    this.location.back();
  }
}
