import { Component, OnInit } from '@angular/core';
import {ToolsService} from '../../common/services/tools.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // 时间
  public dataTime = new Date();
  // 客流量
  public personNum = 60000;
  public persons = [];
  constructor(
    private tools: ToolsService,
  ) { }

  ngOnInit() {
    this.amount();
    this.personNum.toString().split('').map((value, index) => {
      this.persons.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
    });
    setInterval(() => {
      this.dataTime = new Date();
    });
  }
  // 客流量实时监控
  public amount(): void {
    setInterval(() => {
      const b = [];
      this.personNum += Math.round(Math.random() * 10);
      this.personNum.toString().split('').map((value, index) => {
        b.push({number: value, colors: `linear-gradient(${this.tools.randomRgbColor(0)[0]},${this.tools.randomRgbColor(0)[0]})`});
        this.persons = b;
      });
    }, 3000);
  }
}
