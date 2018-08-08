import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConfigModule} from './wenjun-alert.service';

@Component({
  selector: 'app-wenjun-alert',
  templateUrl: './wenjun-alert.component.html',
  styleUrls: ['./wenjun-alert.component.css']
})

export class WenjunAlertComponent implements OnInit, OnChanges {
  @Input() public config: ConfigModule;
  @Input() public alertShow = true;
  constructor() { }

  ngOnInit() {

  }
  public closeAlertShow(): void {
    this.alertShow = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.alertShow);
  }
}
