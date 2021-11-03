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

  @Input() newMessage: Message =  {
    attachments: [],
    content: "",
    fromId: "",
    roomId: "",
    timestamp: Timestamp.now()
  }

  @Input() lastMessage : Message | undefined;
  @Input() nextMessage : Message | undefined;
  @Input() isFromCurrentUser : boolean = false;


  constructor() {

  }

  ngOnInit(): void {
    
  }

  private isLastFromSameUser() {
    return this.lastMessage != undefined && this.lastMessage.fromId == this.newMessage.fromId;
  }

  private isNextFromSameUser() {
    return this.nextMessage != undefined && this.nextMessage.fromId == this.newMessage.fromId;
  }

  private isNextWithinOneMinute() {
    return this.nextMessage != undefined && this.nextMessage.timestamp.toMillis() - this.newMessage.timestamp.toMillis() < 60000;
  }


  shouldDisplayUser() {
    return !this.isLastFromSameUser();
  }

  
  shouldNotDisplayTimestamp() {
    return this.isNextWithinOneMinute() && this.isNextFromSameUser();
  }
  
}
