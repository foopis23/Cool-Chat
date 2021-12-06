import { Component, Input, OnInit } from '@angular/core';
import { Timestamp } from '@firebase/firestore';
import { Observable, Subscription } from 'rxjs';
import { Message } from 'src/app/services/message.service'
import { UserQueryService } from 'src/app/services/user-query.service';
import { User } from 'src/app/types/User';

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
  messageAuthor$: Observable<User> | undefined;
  messageAuthor: User | undefined;
  messagePhoto: string = "";
  defaultPhoto: string = "https://via.placeholder.com/150";

  private messageAuthSubscription: Subscription | undefined;

  constructor(private userService: UserQueryService) {

  }

  ngOnInit(): void {
    this.determineDay();
    this.determineTime();

    this.messageAuthor$ = this.newMessage?.author;
    if (this.newMessage != undefined) {
      this.messageAuthSubscription = this.messageAuthor$?.subscribe((messageAuth: User) => {
        this.messageAuthor = messageAuth;
        this.messagePhoto = this.messageAuthor.photoURL;
      })
    }
  }

  ngOnDestroy(): void {
    if (this.messageAuthSubscription)
      this.messageAuthSubscription.unsubscribe();
  }

  determineDay() {
    if (this.newMessage == undefined) {
      return
    } else {
      switch (this.newMessage.timestamp.toDate().getDay()) {
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
