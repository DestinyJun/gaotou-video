import {
  Component,
  OnInit
} from '@angular/core';
import {EventsService} from '../common/services/events.service';
import {ToolsService} from '../common/services/tools.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 搜索
  public searchForm: FormGroup;
  public selectForm: FormGroup;

  constructor(
    private eventsService: EventsService,
    private fb: FormBuilder,
    private route: Router
  ) {
  }

  ngOnInit() {
    this.buildForm();
  }



  // 搜索的创建表单
  public buildForm(): void {
    this.searchForm = this.fb.group({
      searchText: ['', [Validators.required]]
    });
    this.selectForm = this.fb.group({
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      serZone: ['', [Validators.required]]
    });
  }

  public searchArea(): void {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
    } else {
      window.alert('请输入服务区名称');
    }
  }

  public selectArea(): void {
    if (this.selectForm.value.province === '贵州省' && this.selectForm.value.city === '贵阳市' && this.selectForm.value.serZone === '久长服务区') {
      this.route.navigate(['/home/serzone', {name: this.selectForm.value.serZone}]);
    } else if (this.selectForm.value.province === '贵州省' && this.selectForm.value.city === '贵阳市') {
      this.route.navigate(['/home/city', {name: this.selectForm.value.city}]);
    } else if (this.selectForm.value.province === '贵州省') {
      console.log(1);
      this.route.navigate(['/home/finance']);
    }
    // 时钟
    /* public getTime(): any {
       let week: string;
       let dateTim: any;
       // 日期
       const date = new Date();
       // 年
       const year = date.getFullYear();
       // 月
       const month = date.getMonth() + 1;
       let months: string;
       if (month >= 1 && month <= 9) {
         months = '0' + month;
       } else {
         months = month.toString();
       }
       // 日
       const day = date.getDate();
       let days: string;
       if (day >= 1 && day <= 9) {
         days = '0' + month;
       } else {
         days = day.toString();
       }
       // 周
       const star = date.getDay();
       switch (star) {
         case 0:
           week = '周日';
           break;
         case 1:
           week = '周一';
           break;
         case 2:
           week = '周二';
           break;
         case 3:
           week = '周三';
           break;
         case 4:
           week = '周四';
           break;
         case 5:
           week = '周五';
           break;
         case 6:
           week = '周六';
           break;
       }
       // 时
       const hour = date.getHours();
       let hours: string;
       if (hour >= 1 && hour <= 9) {
         hours = '0' + hour;
       } else {
         hours = hour.toString();
       }
       // 分
       const minute = date.getMinutes();
       let minutes: string;
       if (minute >= 1 && minute <= 9) {
         minutes = '0' + minute;
       } else {
         minutes = minute.toString();
       }
       // 秒
       const second = date.getSeconds();
       let seconds: string;
       if (second >= 1 && second <= 9) {
         seconds = '0' + second;
       } else {
         seconds = second.toString();
       }
       // 组合
       const times = hours + ':' + minutes + ':' + seconds;
       const b = `
               <span style="margin-right: 10px">北京时间</span>
               <span>${year}年</span>
               <span>${months}月</span>
               <span style="margin-right: 10px">${days}日</span>
               <span style="margin-right: 10px">${week}</span>
               <span>${times}</span>`;
       dateTim = year + '-' + months + '-' + days;
     }*/
  }
}
