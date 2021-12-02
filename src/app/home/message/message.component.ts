import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Message } from 'src/app/services/message.service'

interface RawMessage {
  attachments: any[]
  content: string,
  fromId: string,
  roomId: string,
  timestamp: Timestamp
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})

export class MessageComponent implements OnInit {

  @Input() newMessage: Message | undefined;
  @Input() lastMessage: Message | undefined;
  @Input() nextMessage: Message | undefined;
  @Input() isFromCurrentUser: boolean = false;
  messageDay: String | undefined;
  messageTime: String | undefined;


  constructor() {

  }

  ngOnInit(): void {
    this.determineDay();
    this.determineTime();
  }

  determineDay() {
    if (this.newMessage == undefined) {
      return
    } else {
      switch(this.newMessage.timestamp.toDate().getDay()) {
        case 0:
          this.messageDay = "SUN";
          break;
        case 1:
          this.messageDay = "MON";
          break;
        case 2:
          this.messageDay = "TUE";
          break;
        case 3:
          this.messageDay = "WED";
          break;
        case 4:
          this.messageDay = "THUR";
          break;
        case 5:
          this.messageDay = "FRI";
          break;
        case 6:
          this.messageDay = "SAT";
          break;
      }
    }
  }

  determineTime() {
    if (this.newMessage == undefined) {
      return
    } else {
      this.messageTime = this.newMessage.timestamp.toDate().toLocaleTimeString();
    }
  }

  private isLastFromSameUser(): boolean {
    if (this.newMessage == undefined) return false;  
    return this.lastMessage != undefined && this.lastMessage.from.id == this.newMessage.from.id;
  }

  private isNextFromSameUser(): boolean {
    if (this.newMessage == undefined) return false;

    return this.nextMessage != undefined && this.nextMessage.from.id == this.newMessage.from.id;
  }

  private isNextWithinOneMinute(): boolean {
    if (this.newMessage == undefined) return false;
    return this.nextMessage != undefined && this.nextMessage.timestamp.toMillis() - this.newMessage.timestamp.toMillis() < 60000;
  }

  shouldDisplayUser(): boolean {
    return !this.isLastFromSameUser();
  }

  shouldNotDisplayTimestamp() {
    return this.isNextWithinOneMinute() && this.isNextFromSameUser();
  }
}
