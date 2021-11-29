import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Chatroom, ChatroomService } from 'src/app/services/chatroom.service';
import { UserQueryService } from 'src/app/services/user-query.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {
  //chatlist : Chatroom[] | undefined;
  chatlist : Chatroom[] | undefined;
  userId: string;
  
  @Input() selectedChatroom : string | undefined = undefined;
  @Output() changedChatroom = new EventEmitter<string>();

  constructor(authService: AuthService, userQueryService: UserQueryService, private chatroomService: ChatroomService) { 
    chatroomService.userChatroomList$.subscribe((list) => this.chatlist = list);
    this.userId = authService.getUser()?.uid!;
  }

  ngOnInit(): void {
  }

  public setCurrentChatroom(current: string) {
    this.chatroomService.setCurrentChatroom(current);
    this.changedChatroom.emit(current);
  }
}
