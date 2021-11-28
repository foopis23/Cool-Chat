import { Component, OnInit } from '@angular/core';
import { Chatroom, ChatroomService } from 'src/app/services/chatroom.service';
import { UserQueryService } from 'src/app/services/user-query.service';

const DUMMY = [
  {
    displayName: "DisplayName",
    participants: [
      "user1",
      "user2"
    ]
  },
  {
    displayName: "DisplayName2",
    participants: [
      "user1",
      "user2",
      "user3"
    ]
  },
];

@Component({
  selector: 'app-chatlist',
  templateUrl: './chatlist.component.html',
  styleUrls: ['./chatlist.component.scss']
})
export class ChatlistComponent implements OnInit {

  //chatlist : Chatroom[] | undefined;
  chatlist : Chatroom[] | undefined;

  constructor(userQueryService: UserQueryService, chatroomService: ChatroomService) { 
    chatroomService.userChatroomList$.subscribe((list) => this.chatlist = list);
  }

  ngOnInit(): void {
  }
}
