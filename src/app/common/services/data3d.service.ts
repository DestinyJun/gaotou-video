import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Data3dService {
  constructor(
    public http: HttpClient
  ) {}

  public get3dData(): Observable<any> {
    return this.http.get('assets/data/option3d.json');
  }
  public get3dDataGuiYang(): Observable<any> {
    return this.http.get('assets/data/guiyangoption3d.json');
  }
  public data3dFac(): any {
    const dataArray = [];
    for (let i = 0; i < 30; i++) {
      dataArray.push([Math.round(Math.random() * 11), Math.round(Math.random() * 4), Math.round(Math.random() * 100)]);
    }
    return dataArray;
  }
}
