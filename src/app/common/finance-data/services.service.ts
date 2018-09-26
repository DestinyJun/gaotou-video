import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ServicesService {

  constructor(
    private http: HttpClient
  ) { }

  public getAreaNamePoint(): Observable<any> {
    return this.http.get('http://192.168.28.35:8080/highway-management/common/config/getServiceAreaCoordinate/2')
  }

}
