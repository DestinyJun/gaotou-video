import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {GlobalService} from './global.service';

@Injectable()
export class FinanceDataService {

  constructor(
    private http: HttpClient,
    private globalService: GlobalService
  ) { }
  public getServiceNamePoint(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/common/config/getServiceAreaCoordinate/2`);
  }
  public searchTopBar(): Observable<any> {
    return this.http.get(`${this.globalService.urls}/realTime/top10/province/2/sortBy/1`);
  }
}
