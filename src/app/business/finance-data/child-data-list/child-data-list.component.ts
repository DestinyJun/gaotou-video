import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-child-data-list',
  templateUrl: './child-data-list.component.html',
  styleUrls: ['./child-data-list.component.css']
})
export class ChildDataListComponent implements OnInit {
  public typeTitle: string;
  public unit: string;
  public datas: any;
  public tableThead: Array<string>;
  public tableFlag: boolean;

  constructor(
    public http: HttpClient,
  ) {}

  ngOnInit() {
    if (this.typeTitle === '车流量排名') {
      this.tableFlag = true;
      this.tableThead = ['排名', '服务区名称', '数值', '服务区行车方向', '数据区域'];
      this.http.get('assets/data/park.json').subscribe(
        (res) => {
          this.datas = res;
        }
      );
      this.unit = '（辆）';
    } else if (this.typeTitle === '收入排名') {
      this.tableFlag = true;
      this.tableThead = ['排名', '服务区名称', '数值', '服务区行车方向', '数据区域'];
      this.http.get('assets/data/income.json').subscribe(
        (res) => {
          this.datas = res;
        }
      );
      this.unit = '（元）';
    } else {
      this.tableFlag = false;
      this.tableThead = ['服务区名称', '事件发生时间', '事件类型', '服务区行车方向', '事件区域'];
      this.http.get('assets/data/event.json').subscribe(
        (res) => {
          this.datas = res;
        }
      );
      this.unit = '';
    }
  }

}
