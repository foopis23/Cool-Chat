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


  constructor() {

  }

  ngOnInit(): void {

  }

  private isLastFromSameUser(): boolean {
    if (this.newMessage == undefined) return false;
    return this.lastMessage != undefined && this.lastMessage.fromId == this.newMessage.fromId;
  }

  private isNextFromSameUser(): boolean {
    if (this.newMessage == undefined) return false;

    return this.nextMessage != undefined && this.nextMessage.fromId == this.newMessage.fromId;
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
