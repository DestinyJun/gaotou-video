import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ServiceDataService {

  constructor(
    private http: HttpClient
  ) { }
  public getServiceShopVDate(): Observable<any> {
    return this.http.get('http://120.78.137.182:8888/highway-management/common/config/getStoreAndCamera/1');
  }
}
