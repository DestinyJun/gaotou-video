import { Component, OnInit } from '@angular/core';
import {EventsService} from '../shared/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public navShow = false;
  constructor(
    private eventsService: EventsService
  ) { }

  ngOnInit() {
  }
  // 控制侧边导航栏显示隐藏
  public navShowClick(): void {
    this.navShow = !this.navShow;
    setTimeout(() => {
      this.eventsService.eventBus.next('点击导航条');
    }, 3000);
  }
}
