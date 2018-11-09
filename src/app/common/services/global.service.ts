import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class GlobalService {
  public eventSubject: Subject<any> = new Subject<any>(); // 控制全局加载动画
  public urls = `http://120.78.137.182:8888/highway-management`;
  constructor(
    private http: HttpClient
  ) {
  }
  // 分页查询
  public searchList(num): Observable<any> {
    return this.http.post(
      `${this.urls}/administrativeArea/queryTreeByPaging/${num.page}/${num.nums}`, {});
  }
}
