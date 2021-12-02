import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserQueryService } from 'src/app/services/user-query.service';
import { User } from 'src/app/types/User';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss']
})
export class CurrentUserComponent implements OnInit {

  user: User | undefined;

  constructor(private userQueryService: UserQueryService, private authService: AuthService) {
    userQueryService.getUserById(authService.getUser()!.uid).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

}
