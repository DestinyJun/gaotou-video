import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class VideoWindowService {

  constructor(
    private http: HttpClient
  ) { }
  public getAreaList(): Observable<any> {
    return this.http.get('http://120.78.137.182:8808/highway-management/common/config/getAllAdministrativeAreaTree');
  }
}
