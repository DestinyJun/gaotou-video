import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CityDataService {

  constructor(
    private http: HttpClient
  ) { }
  // 返回服务区名称
  public getServiceNamePoint(): Observable<any> {
    return this.http.get('http://120.78.137.182:8808/highway-management/common/config/getServiceAreaCoordinate/3');
  }
}
