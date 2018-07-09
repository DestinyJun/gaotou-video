import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DiagramService {

  constructor(
    private http: HttpClient
  ) { }
  public getIncomerRanked(): Observable<any> {
    return this.http.get('assets/data/Incomeranked.json');
  }
  public getCarTypes(): Observable<any> {
    return this.http.get('assets/data/Incomeranked.json');
  }
  public getIncomeTypes(): Observable<any> {
    return this.http.get('assets/data/Incomeranked.json');
  }
}
