import { Injectable } from '@angular/core';

@Injectable()
export class WenjunAlertService {
  public alertShow = false;
  constructor() { }
  public closeAlertShow(): void {
    this.alertShow = false;
  }
  public openAlertShow(): void {
    this.alertShow = true;
  }
}


export class ConfigModule {
  alertTitle?: string;
  titleColor?: string;
  titleBgColor?: string;
  closeHoverBgColor?: string;
  background?: string;
  width?: number;
  height?: number;
}
