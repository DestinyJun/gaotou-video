import {
  AfterContentInit,
  AfterViewInit,
  Component, ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {EventsService} from '../shared/events.service';
import {NavComponent} from './nav/nav.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges, AfterContentInit, AfterViewInit {
  public navShow = false;
  // 动态创建组件
  @ViewChild('navFlag', {read: ViewContainerRef})
  navFlag: ViewContainerRef;
  compNav1: ComponentRef<NavComponent>;

  constructor(
    private eventsService: EventsService,
    private resolver: ComponentFactoryResolver
  ) { }
  ngOnChanges(changes: SimpleChanges): void {

  }
  ngOnInit() {
  }
  ngAfterContentInit(): void {

  }

  ngAfterViewInit(): void {

  }
  // 控制侧边导航栏显示隐藏
  public navShowClick(): void {
    this.navShow = !this.navShow;
    if (this.navShow) {
      const childNavComp1 = this.resolver.resolveComponentFactory(NavComponent);
      this.compNav1 = this.navFlag.createComponent(childNavComp1);
    } else {
      this.destoryChild();
    }
    this.eventsService.eventBus.next('点击导航条');
  }
  // 销毁已创建的组建
  public destoryChild(): void {
    this.compNav1.destroy();
  }
}
