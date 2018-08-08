import { Injectable } from '@angular/core';

@Injectable()
export class WenjunAlertService {

  constructor() { }

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
