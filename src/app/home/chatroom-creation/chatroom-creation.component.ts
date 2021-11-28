import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-chatroom-creation',
  templateUrl: './chatroom-creation.component.html',
  styleUrls: ['./chatroom-creation.component.scss']
})
export class ChatroomCreationComponent implements OnInit {
  private users : User[];
  chatroomName : string;
  canCreate : boolean;

  constructor(private chatroomSvc : ChatroomService ) {
    this.users = [];
    this.canCreate = true;
    this.chatroomName = '';
  }

  ngOnInit(): void {
  }

  onSelectedUsersChange(users : User[]) {
    this.users = users;
    // this.canCreate = this.users.length > 1 && this.chatroomName.length > 0;
  }

  onCreate() {
    this.chatroomSvc.createChatroom(this.chatroomName, this.users);
  }
}
