import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-window',
  templateUrl: './message-window.component.html',
  styleUrls: ['./message-window.component.css']
})
export class MessageWindowComponent implements OnInit {
  public messageWindowShow = false;
  constructor() { }

  ngOnInit() {
    setInterval(() => {
      document.body.className = 'ui-overflow-hidden';
      this.messageWindowShow = true;
    }, 600000);
  }
  public closeCarShow(): void {
    this.messageWindowShow = false;
    document.body.className = '';
  }
}
