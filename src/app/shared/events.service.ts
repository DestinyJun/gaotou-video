import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class EventsService {
  public eventBus: Subject<any> = new Subject<string>();
  constructor() { }

}
