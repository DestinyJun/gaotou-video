import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ConfigModule, WenjunAlertService} from './wenjun-alert.service';

@Component({
  selector: 'app-wenjun-alert',
  templateUrl: './wenjun-alert.component.html',
  styleUrls: ['./wenjun-alert.component.css']
})

export class WenjunAlertComponent implements OnInit, OnChanges {
  // public alertShow: boolean;
  @Input() public config: ConfigModule;
  constructor(
    public alertService: WenjunAlertService
  ) { }
  ngOnInit() {
    // this.alertShow = this.alertService.alertShow;
  }

  ngOnChanges(changes: SimpleChanges): void {}
  public alertMouseenter(e) {
    e.srcElement.style.backgroundColor = this.config.closeHoverBgColor;
  }
  public alertMouseleave(e) {
    e.srcElement.style.backgroundColor = '';
  }
}
