import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {
  // btn状态值判断
  public btnProfileTxt = true;
  public btnPasswordTxt = true;
  constructor() { }

  ngOnInit() {
  }
  public updataProfile() {
    this.btnProfileTxt = !this.btnProfileTxt;
  }
  public updataPaaword() {
    this.btnPasswordTxt = !this.btnPasswordTxt;
  }
}
