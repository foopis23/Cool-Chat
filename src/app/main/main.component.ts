import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})


export class MainComponent implements OnInit {

  currentChatroomId: string | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  setCurrentChatroom(id: string) {
    this.currentChatroomId = id;
  }

}
