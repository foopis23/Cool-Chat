import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService, Message } from 'src/app/services/message.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  @Input() chatroomId : string = "";

  messages$: Observable<Message[]> | undefined;
  messageInput : string;
  newUserMessage = true;
  messages : Message[];

  constructor(private messageSvc : MessageService) {
    this.messages = [];
    this.messageInput = '';
  }

  ngOnInit(): void {
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this.chatroomId);
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    })

        //TODO: subscribe to current user data here and store in variable...
  }

  isFromCurrentUser(message : Message) {
    //TODO: compare current user variable to message fromId

    return false;
  }

  submitMessage() {
    if (this.messageInput && this.messageInput !== "") {
      this.messageSvc.sendMessageToChatroom(this.chatroomId, 'JDXybYhH1npHWAZOPdj5', this.messageInput);
      this.messageInput = '';
    }

    return false;
  }
}

