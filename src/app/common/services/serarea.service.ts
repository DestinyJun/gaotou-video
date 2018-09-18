import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SerareaService {

  constructor(
    private http: HttpClient
  ) {}
  public getServiceShopVDate(): Observable<any> {
    return this.http.get('http://120.78.137.182:8808/highway-management/common/config/getStoreAndCamera/1');
  }

}
