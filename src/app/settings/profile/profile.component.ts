import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/types/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserQueryService } from 'src/app/services/user-query.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User | undefined;
  private userSubscription: Subscription | undefined;

  constructor(private userQueryService: UserQueryService, private authService: AuthService, private _router: Router) {
    this.userSubscription = userQueryService.getUserById(authService.getUser()!.uid).subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
  }

}
