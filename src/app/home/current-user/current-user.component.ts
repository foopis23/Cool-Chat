import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private userQueryService: UserQueryService, private authService: AuthService, private _router : Router) {
    userQueryService.getUserById(authService.getUser()!.uid).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout().then(() => {
      this._router.navigateByUrl("/login");
    }).catch(err => console.error(err))
    return false;
  }
}
