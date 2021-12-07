import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Chatroom, ChatroomService, UserChatroom } from 'src/app/services/chatroom.service';
import { UserQueryService } from 'src/app/services/user-query.service';
import { EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {
  //chatlist : Chatroom[] | undefined;
  chatlist: UserChatroom[] | undefined;
  userId: string;

  @Input() selectedChatroom: string | undefined = undefined;
  @Output() changedChatroom = new EventEmitter<string>();
  private userChatroomListSubscription: Subscription | undefined;

  private currentChatroom : string | undefined;

  constructor(private authService: AuthService, userQueryService: UserQueryService, private chatroomService: ChatroomService) {
    this.userChatroomListSubscription = chatroomService.userChatroomList$.subscribe((list) => this.chatlist = list);
    this.userId = authService.getUser()?.uid!;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.userChatroomListSubscription) {
      this.userChatroomListSubscription.unsubscribe();
    }
  }

  public setCurrentChatroom(current: string | undefined) {
    if (this.currentChatroom !== undefined) {
      this.authService.updateChatroomLastViewedDate(this.currentChatroom);
    }
    
    this.currentChatroom = current;
    
    if (current !== undefined) {
      this.chatroomService.setCurrentChatroom(current);
      this.authService.updateChatroomLastViewedDate(current);
    }

    this.changedChatroom.emit(current);
  }

  public leaveChatroom(roomId: string | undefined) {
    if (roomId !== undefined)
      this.chatroomService.leaveChatroom(roomId);
    this.setCurrentChatroom(undefined);
  }
}