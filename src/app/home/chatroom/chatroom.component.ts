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

  private isScrollToBottom: boolean;

  private messagesSubscription: Subscription | undefined;
  private currentUserDataSubscription: Subscription | undefined;
  private currentChatroomSubscription: Subscription | undefined;

  constructor(private chatroomService: ChatroomService, private messageSvc: MessageService, private authSvc: AuthService, private chatroomSvc: ChatroomService) {
    this.messages = [];
    this.messageInput = '';
    this.isScrollToBottom = true;
  }

  @Input() set chatroomId(id: string) {
    this._chatroomId = id;
    this.messages$ = this.messageSvc.getMessagesFromChatroomId(this._chatroomId);

    if (this.messagesSubscription !== undefined)
      this.messagesSubscription.unsubscribe();

    this.messagesSubscription = this.messages$.subscribe((messages) => {
      this.messages = messages;
    })

    this.currentUserData$ = this.authSvc.authState$;

    if (this.currentUserDataSubscription !== undefined)
      this.currentUserDataSubscription.unsubscribe();

    this.currentUserDataSubscription = this.currentUserData$.subscribe((currentUser: User) => {
      this.currentUser = currentUser;
    });

    //Set chatroomParticipants and subscribe to it for future use to set the chatroom to get the current participants
    if (this._chatroomId) {
      this.currentChatroom$ = this.chatroomSvc.getChatroom$(this._chatroomId);
    }

    if (this.currentChatroomSubscription !== undefined)
      this.currentChatroomSubscription.unsubscribe();

    this.currentChatroomSubscription = this.currentChatroom$?.subscribe((currentChatroom: Chatroom) => {
      this.currentChatroom = currentChatroom;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.messagesSubscription !== undefined)
      this.messagesSubscription.unsubscribe();

    if (this.currentUserDataSubscription !== undefined)
      this.currentUserDataSubscription.unsubscribe();

    if (this.currentChatroomSubscription !== undefined)
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

  handleScrollEvent($event: any) {
    if (this.historyContainer) {
      const el = this.historyContainer.nativeElement;
      this.isScrollToBottom = el.scrollTop + el.clientHeight === el.scrollHeight;
    }
  }
}

