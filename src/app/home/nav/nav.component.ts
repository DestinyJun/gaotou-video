import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  public navOpacity = '0.4';
  public navHeight = '50px';
  @HostListener('mouseenter') onMouserEnter() {
    this.navOpacity = '1';
    this.navHeight = 'auto';
  }
  @HostListener('mouseleave') onMouserLeave() {
    this.navOpacity = '0.4';
    this.navHeight = '50px';
  }
  @HostListener('mouseenter') onClick() {
    if (this.navOpacity === '1') {
      this.navOpacity = '0.4';
      this.navHeight = '50px';
    } else if (this.navOpacity === '0.4') {
      this.navOpacity = '1';
      this.navHeight = 'auto';
    }
  }
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {}
  public wholeClick(): void {
    this.router.navigate(['home/whole']);
  }
  public financeClick(): void {
    this.router.navigate(['home/finance']);
  }
  public cityClick(): void {
    this.router.navigate(['home/city']);
  }
  public serzoneClick(): void {
    this.router.navigate(['home/serzone', {name: '久长服务区', point: [116.39737, 39.935076]}]);
  }
  public videowClick(): void {
    this.router.navigate(['home/videow']);
  }
}
