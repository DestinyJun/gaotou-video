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
  public get3dDataCopy(): Observable<any> {
    return this.http.get('assets/data/option3dCopy.json');
  }
  public get3dDataGuiYang(): Observable<any> {
    return this.http.get('assets/data/guiyangoption3d.json');
  }
  public data3dFac(): any {
    const dataArray = [];
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const types = [0, 1, 2];
    months.map((val, index) => {
      for (let i = 0; i < types.length; i++) {
        dataArray.push([val, types[i], Math.round(Math.random() * 100), Math.round(Math.random() * 10000)]);
      }
    });
    /*for (let i = 0; i < 200; i++) {
      dataArray.push([Math.round(Math.random() * 11), Math.round(Math.random() * 4), Math.round(Math.random() * 100)]);
    }*/
    return dataArray;
  }
  public data3dFacCopy(): any {
    const dataArray = [];
    const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    const types = [0, 1];
    months.map((val, index) => {
      for (let i = 0; i < types.length; i++) {
        dataArray.push([val, types[i], Math.round(Math.random() * 100), Math.round(Math.random() * 10000)]);
      }
    });
    /*for (let i = 0; i < 200; i++) {
      dataArray.push([Math.round(Math.random() * 11), Math.round(Math.random() * 4), Math.round(Math.random() * 100)]);
    }*/
    return dataArray;
  }
}
