import { Component, OnInit } from '@angular/core';
import {LoginService} from '../../common/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public dataTime: string;
  constructor(
    private logins: LoginService
  ) { }

  ngOnInit() {
    const a = this.logins.getTime();
    this.dataTime = a.time1;
  }
}
