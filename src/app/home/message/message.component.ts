import { Component, Injectable, Input, OnInit } from '@angular/core';

export interface message {
  userId: String;
  body: String;
  time: String;
  prevUserId: String;
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {

  @Input() newMessage: message = {
    userId: "",
    body: "",
    time: "",
    prevUserId: ""
  }


  constructor() {
    
  }

  ngOnInit(): void {

  }

}
