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
  public getIncomerRankedGuiYang(): Observable<any> {
    return this.http.get('assets/data/IncomerankedGuiYang.json');
  }
  public getCarTypes(): Observable<any> {
    return this.http.get('assets/data/cartypes.json');
  }
  public getCarTypesGuiYang(): Observable<any> {
    return this.http.get('assets/data/cartypesGuiYang.json');
  }
  public getIncomeTypes(): Observable<any> {
    return this.http.get('assets/data/incometypes.json');
  }
  public getIncomeTypesGuiYang(): Observable<any> {
    return this.http.get('assets/data/incometypesGuiYang.json');
  }
}
