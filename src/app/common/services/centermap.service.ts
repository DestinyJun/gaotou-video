import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class CentermapService {

  constructor(
    public http: HttpClient
  ) { }
  public getCenterMapData(): Observable<any> {
    return this.http.get('assets/data/centermap.json');
  }
}
