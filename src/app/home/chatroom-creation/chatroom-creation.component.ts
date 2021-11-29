import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatroomService } from 'src/app/services/chatroom.service';
import { UserQueryService } from 'src/app/services/user-query.service';
import { User } from 'src/app/types/User';
import { UserSearchComponent } from '../user-search/user-search.component';

@Component({
  selector: 'app-chatroom-creation',
  templateUrl: './chatroom-creation.component.html',
  styleUrls: ['./chatroom-creation.component.scss']
})
export class ChatroomCreationComponent implements OnInit {
  @Output() chatroomCreated: EventEmitter<string>;

  @ViewChild('usersearch') userSearch: UserSearchComponent | undefined;
  chatroomName: string;
  private selectedUsers: User[];

  constructor(private chatroomSvc: ChatroomService, private authSvc: AuthService, private usrSvc: UserQueryService) {
    this.selectedUsers = [];
    // this.canCreate = true;
    this.chatroomName = '';
    this.chatroomCreated = new EventEmitter();
  }

  ngOnInit(): void {}

  onSelectedUsersChange(users: User[]) {
    this.selectedUsers = users;
  }

  async onCreate() {
    let ref = await this.chatroomSvc.createChatroom(this.chatroomName, this.selectedUsers);
    this.chatroomCreated.emit(ref.id)
    if (this.userSearch)
      this.userSearch.reset();

    this.chatroomName = '';
  }

  canCreate() {
    return this.selectedUsers.length > 1 && this.chatroomName.length > 0;
  }
}
