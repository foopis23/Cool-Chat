import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService, Message } from 'src/app/services/message.service';
import { User } from '@angular/fire/auth';
import { Chatroom, ChatroomService } from 'src/app/services/chatroom.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  @ViewChild('messageHistoryContainer') historyContainer: ElementRef | undefined;
  
  _chatroomId: string = '';
  messages$: Observable<Message[]> | undefined;
  messageInput: string;
  newUserMessage = true;
  messages: Message[];
  //Might need to work on typing for this
  userData: Observable<User> | undefined;
  currentUserData$: any;
  currentUser!: User;
  currentChatroom$: Observable<Chatroom> | undefined;
  currentChatroom: Chatroom | undefined;

  private isScrollToBottom : boolean;

  private messagesSubscription : Subscription | undefined;
  private currentUserDataSubscription : Subscription | undefined;
  private currentChatroomSubscription : Subscription | undefined;

  constructor(private chatroomService: ChatroomService, private messageSvc: MessageService, private authSvc: AuthService, private chatroomSvc: ChatroomService) {
    this.messages = [];
    this.messageInput = '';
    this.isScrollToBottom = true;
  }

  @Input() set chatroomId(id: string) {
    this._chatroomId = id;
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this._chatroomId);
    this.messagesSubscription = this.messages$.subscribe((messages) => {
      this.messages = messages;
      // this.scrollToBottom();
    })

    //I used auth service for now cause that seemed like getUser would be the way to get the current logged in user
    //But it doesn't seem to be working and using authstate didnt either so I'm not sure if im in doing  it correctly or not

    //I think this is working to get the current logged in user
    this.currentUserData$ = this.authSvc.authState$;

    this.currentUserDataSubscription = this.currentUserData$.subscribe((currentUser: User) => {
      this.currentUser = currentUser;
      // this.scrollToBottom();
    });

    //Set chatroomParticipants and subscribe to it for future use to set the chatroom to get the current participants
    if (this._chatroomId) {
      this.currentChatroom$ = this.chatroomSvc.getChatroom$(this._chatroomId);
    }

    this.currentChatroomSubscription = this.currentChatroom$?.subscribe((currentChatroom: Chatroom) => {
      this.currentChatroom = currentChatroom;
      // this.scrollToBottom();
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {}
  
  ngOnDestroy() : void {
    if (this.messagesSubscription != undefined)
      this.messagesSubscription.unsubscribe();

    if (this.currentUserDataSubscription)
      this.currentUserDataSubscription.unsubscribe();

    if (this.currentChatroomSubscription?.unsubscribe())
      this.currentChatroomSubscription.unsubscribe();
  }

  isFromCurrentUser(message: Message) {
    if (this.currentUser?.uid == message.from.id) {
      return true;
    } else {
      return false;
    }
  }

  submitMessage() {
    if (this.messageInput && this.messageInput !== "") {
      this.messageSvc.sendMessageToChatroom(this._chatroomId, this.currentUser.uid, this.messageInput);
      this.messageInput = '';

      // if send a message scroll to bottom
      this.isScrollToBottom = true;
      // this.scrollToBottom();
    }

    return false;
  }

  getCurrentChatroom(): string {
    return this.chatroomService.getCurrentChatroom();
  }

  private scrollToBottom() {
    if (this.historyContainer && this.isScrollToBottom) {
      this.historyContainer.nativeElement.scrollTop = this.historyContainer.nativeElement.scrollHeight;
    }
  }

  handleScrollEvent($event : any) {
    if (this.historyContainer) {
      const el = this.historyContainer.nativeElement;
      this.isScrollToBottom = el.scrollTop + el.clientHeight === el.scrollHeight;
    }
  }
}

