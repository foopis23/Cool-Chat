import { Component, Input, OnInit } from '@angular/core';
import { user } from 'rxfire/auth';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { User } from 'src/app/types/User'
import { UserQueryService } from 'src/app/services/user-query.service';

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
  //Might need to work on typing for this
  userData: Observable<User> | undefined;
  currentUserData$: any;
  currentUser: User | undefined;



  constructor(private messageSvc : MessageService, private authSvc: AuthService) {
    this.messages = [];
    this.messageInput = '';
  }

  ngOnInit(): void {
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this.chatroomId);
    this.messages$.subscribe((messages) => {
      this.messages = messages;
    })

        //TODO: subscribe to current user data here and store in variable...
        //I used auth service for now cause that seemed like getUser would be the way to get the current logged in user
        //But it doesn't seem to be working and using authstate didnt either so I'm not sure if im in doing  it correctly or not
        this.currentUserData$ = this.authSvc.getUser();
        
        this.currentUserData$.subscribe((currentUser: User | undefined) => {
          this.currentUser = currentUser;
        })

  }

  isFromCurrentUser(message : Message) {
    //TODO: compare current user variable to message fromId
    //Not really sure if this is the correct way to implement current User or not
    /*
    console.log(this.currentUser?.id);
    console.log(message.from.id);
    if (this.currentUser?.id == message.from.id) {
      return true;
    } else {
      return false;
    }
    */

    //Left this manual test in place for now since I don't think my current user is working right and i'm 
    //just easily testing to see what messages look like on both sides of the screen
    //There is also some wierdness going on regarding any of the messages that have an idea which I believe is not
    //in the within the users (so I think thats way profile circle, username, etc. are acting up)
    console.log("JDXybYhH1npHWAZOPdj5");
    console.log(message.from.id);
    console.log("JDXybYhH1npHWAZOPdj5" == message.from.id);
    if ("JDXybYhH1npHWAZOPdj5" == message.from.id) {
      return true;
    } else {
      return false;
    }
  }

  submitMessage() {
    if (this.messageInput && this.messageInput !== "") {
      this.messageSvc.sendMessageToChatroom(this.chatroomId, 'JDXybYhH1npHWAZOPdj5', this.messageInput);
      this.messageInput = '';
    }

    return false;
  }
}

