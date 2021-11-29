import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService, Message } from 'src/app/services/message.service';
//import { User } from 'src/app/types/User';
import { User } from '@angular/fire/auth';
import { ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  _chatroomId: string = '';


  messages$: Observable<Message[]> | undefined;
  messageInput : string;
  newUserMessage = true;
  messages : Message[];
  //Might need to work on typing for this
  userData: Observable<User> | undefined;
  currentUserData$: any;
  currentUser!: User;

  constructor(private chatroomService: ChatroomService, private messageSvc : MessageService, private authSvc: AuthService) {
    this.messages = [];
    this.messageInput = '';
  }

  @Input() set chatroomId(id: string) {
    this._chatroomId = id;
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this._chatroomId);
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    })

        //TODO: subscribe to current user data here and store in variable...
        //I used auth service for now cause that seemed like getUser would be the way to get the current logged in user
        //But it doesn't seem to be working and using authstate didnt either so I'm not sure if im in doing  it correctly or not

        //I think this is working to get the current logged in user
        this.currentUserData$ = this.authSvc.authState$;

        this.currentUserData$.subscribe((currentUser: User) => {
          this.currentUser = currentUser;
          console.log(this.currentUser?.uid);
        });

  }

  ngOnInit(): void {}

  /*ngOnInit(): void {
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this.chatroomId);
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    })

        //TODO: subscribe to current user data here and store in variable...
        //I used auth service for now cause that seemed like getUser would be the way to get the current logged in user
        //But it doesn't seem to be working and using authstate didnt either so I'm not sure if im in doing  it correctly or not

        //I think this is working to get the current logged in user
        this.currentUserData$ = this.authSvc.authState$;

        this.currentUserData$.subscribe((currentUser: User) => {
          this.currentUser = currentUser;
          console.log(this.currentUser?.uid);
        });

  }*/

  isFromCurrentUser(message : Message) {
    //TODO: compare current user variable to message fromId
    //I think this is up and working
    if (this.currentUser?.uid == message.from.id) {
      return true;
    } else {
      return false;
    }
  }

  submitMessage() {
    if (this.messageInput && this.messageInput !== "") {
      //this.messageSvc.sendMessageToChatroom(this.chatroomId, 'JDXybYhH1npHWAZOPdj5', this.messageInput);
      this.messageSvc.sendMessageToChatroom(this._chatroomId, this.currentUser.uid, this.messageInput);
      this.messageInput = '';
    }

    return false;
  }

  getCurrentChatroom(): string {
    console.log(this.getCurrentChatroom());
    return this.chatroomService.getCurrentChatroom();
  }
}

