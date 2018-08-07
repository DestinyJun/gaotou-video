import { Component, OnInit } from '@angular/core';

interface Config {
  titleColor: string;
  titleBgColor: string;
  background: string;
  width: string;
  height: string;
}

@Component({
  selector: 'app-wenjun-alert',
  templateUrl: './wenjun-alert.component.html',
  styleUrls: ['./wenjun-alert.component.css']
})

export class WenjunAlertComponent implements OnInit {
  public config: Config;
  public alertShow = true;
  public alertTitle = '默认标题';
  constructor() { }

  ngOnInit() {
    this.config = {
      titleColor: 'white',
      titleBgColor: 'rgba(240,43,43,0.8)',
      background: '255,255,255,0.6',
      width: '50vw',
      height: '50vh',
    };
  }
  public closeAlertShow(): void {
    this.alertShow = false;
  }
}
