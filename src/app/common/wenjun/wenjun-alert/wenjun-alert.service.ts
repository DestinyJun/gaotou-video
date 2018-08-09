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
  constructor (
    public alertTitle: string,
    public titleColor: string,
    public titleBgColor: string,
    public background: string,
    public width: number,
    public height: number,
  ) {}
}
