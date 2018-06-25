import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public navOpacity = '0.4';
  public navHeight = '50px';
  constructor() { }

  ngOnInit() {
  }
  @HostListener('mouseenter') onMouserEnter() {
    this.navOpacity = '1';
    this.navHeight = 'auto';
  }
  @HostListener('mouseleave') onMouserLeave() {
    this.navOpacity = '0.4';
    this.navHeight = '50px';
  }
}
